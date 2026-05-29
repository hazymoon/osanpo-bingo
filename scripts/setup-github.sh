#!/usr/bin/env bash
# @file setup-github.sh
# @brief GitHub public 公開リポジトリの推奨設定を冪等に適用する
# @description
#   push 後に一度実行すると、セキュリティ機能の有効化・main ブランチ保護・
#   リポジトリメタ情報をまとめて設定する。何度実行しても結果は同じ（冪等）。
#
#   前提:
#     - gh CLI が認証済みで、対象リポジトリへの admin 権限を持つこと
#     - リポジトリが GitHub 上に作成され、push 済みであること
#     - ブランチ保護の status check は CI が一度実行された後に有効になる
#
#   使い方:
#     scripts/setup-github.sh                 # git remote から owner/repo を解決
#     scripts/setup-github.sh owner/repo      # 明示指定

set -uo pipefail

# --- 設定値（必要に応じて編集）---------------------------------------------
DESCRIPTION="街で見つけたものでビンゴをする、幼児向けのおさんぽビンゴ（オフライン対応 PWA）"
HOMEPAGE="" # GitHub Pages 等の公開 URL があれば設定
TOPICS=(pwa react typescript vite offline-first kids bingo japanese)
DEFAULT_BRANCH="main"
CI_CHECK_CONTEXT="check" # .github/workflows/ci.yml のジョブ名
# ---------------------------------------------------------------------------

# @description 手順を実行し、失敗しても警告にとどめて次へ進む（best-effort 適用）。
# @arg $1 string 手順の説明
# @arg $@ コマンド
run_step() {
  local desc="$1"
  shift
  echo "==> ${desc}"
  if "$@" >/dev/null 2>&1; then
    echo "    OK"
  else
    echo "    SKIP/FAIL: 権限・プラン制約や未対応設定の可能性。GitHub の設定画面を確認してください。" >&2
  fi
}

# @description owner/repo を引数 or git remote から解決する。
resolve_repo() {
  if [[ $# -ge 1 && -n "${1:-}" ]]; then
    echo "$1"
    return
  fi
  gh repo view --json nameWithOwner -q .nameWithOwner
}

command -v gh >/dev/null 2>&1 || {
  echo "gh CLI が見つかりません。https://cli.github.com/ を導入してください。" >&2
  exit 1
}
gh auth status >/dev/null 2>&1 || {
  echo "gh が未認証です。'gh auth login' を実行してください。" >&2
  exit 1
}

REPO="$(resolve_repo "${1:-}")"
if [[ -z "${REPO}" ]]; then
  echo "owner/repo を解決できませんでした。引数で指定してください（例: owner/repo）。" >&2
  exit 1
fi
echo "対象リポジトリ: ${REPO}"
echo

# 1) Dependabot alerts（脆弱性アラート）を有効化
run_step "Dependabot alerts を有効化" \
  gh api --method PUT "/repos/${REPO}/vulnerability-alerts"

# 2) Dependabot security updates（自動修正 PR）を有効化
run_step "Dependabot security updates を有効化" \
  gh api --method PUT "/repos/${REPO}/automated-security-fixes"

# 3) private vulnerability reporting を有効化（SECURITY.md の報告導線）
run_step "Private vulnerability reporting を有効化" \
  gh api --method PUT "/repos/${REPO}/private-vulnerability-reporting"

# 4) Secret scanning と push protection を有効化（public は無料）
echo "==> Secret scanning / push protection を有効化"
if gh api --method PATCH "/repos/${REPO}" --input - >/dev/null 2>&1 <<JSON
{
  "security_and_analysis": {
    "secret_scanning": { "status": "enabled" },
    "secret_scanning_push_protection": { "status": "enabled" }
  }
}
JSON
then
  echo "    OK"
else
  echo "    SKIP/FAIL: 権限やプラン制約の可能性。GitHub の Security 設定を確認してください。" >&2
fi

# 5) main ブランチ保護: CI 必須・PR 必須・force push/削除を禁止
#    enforce_admins=false のためオーナー（admin）は緊急時に直接 push 可能。
#    オーナーにも強制するなら enforce_admins を true にする。
echo "==> ${DEFAULT_BRANCH} ブランチ保護を設定（status check: ${CI_CHECK_CONTEXT}）"
if gh api --method PUT "/repos/${REPO}/branches/${DEFAULT_BRANCH}/protection" \
  --input - >/dev/null 2>&1 <<JSON
{
  "required_status_checks": { "strict": true, "contexts": ["${CI_CHECK_CONTEXT}"] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
then
  echo "    OK"
else
  echo "    SKIP/FAIL: ブランチが未 push か、CI が未実行で check 未登録の可能性。push と CI 実行後に再実行してください。" >&2
fi

# 6) リポジトリのメタ情報（説明・トピック・公開 URL）
metadata_args=(--description "${DESCRIPTION}")
[[ -n "${HOMEPAGE}" ]] && metadata_args+=(--homepage "${HOMEPAGE}")
for t in "${TOPICS[@]}"; do metadata_args+=(--add-topic "$t"); done
run_step "リポジトリの説明・トピックを設定" \
  gh repo edit "${REPO}" "${metadata_args[@]}"

echo
echo "完了。GitHub の Settings / Security タブで反映を確認してください。"
