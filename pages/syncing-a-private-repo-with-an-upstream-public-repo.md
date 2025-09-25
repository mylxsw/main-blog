---
title: "Syncing a Private Repo with an Upstream Public Repo"
date: 2025-09-12
tags: []
category: "技术分享"
---
# Syncing a Private Repo with an Upstream Public Repo

## Keep private repo in sync with the remote public repo

Scenario: AIdea customer needs a piece of custom code, I need to Fork a piece of code from AIdea's public repository to a private repository, make changes to it, and periodically synchronize AIdea's changes to that private repository.

1. Clone public repository code to local
	```bash
	git clone https://github.com/mylxsw/aidea-server.git
	```
2. Change the repository address to your own private repository address
    ```bash
    git remote remove origin
    git remote add origin https://github.com/new-user-org/server.git
    git push --set-upstream origin main
    ```
3. Adding upstream addresses of public open source repositories
    ```bash
    git remote add upstream https://github.com/mylxsw/aidea-server.git
    ```
4. When you need to synchronize remote open source branch code, execute the following command
    ```bash
    # update new codes
    git fetch upstream
    # merge to remote branch
    git merge upstream/main
    ```

## Use patch to add local commits to other branches

**Scenario**

You pull the develop branch locally from the staging branch, and after several commits you want to initiate a Pull request to merge into the staging branch; however, the staging branch has been rebased, modifying the branch history and making it impossible to merge the local branch into staging.

**Solution**

Use the `patch` function to create a patch of the local modifications, then reapply it to the staging branch using `apply`.

```bash
# First use the git log command to view the modification history:
git log --oneline -n 10

# Use the git patch command to create a patch:
git format-patch --stdout 9451e7d^..HEAD > diff.patch

# Switch to the target branch (it's best to create a new branch `new-staging` from staging)
git checkout staging # (be sure to sync to the latest code)
git checkout -b new-staging

# Apply the patch
git apply diff.patch

# Delete the patch file:
rm -fr diff.patch
```

---
> 本文由 AI 创建于 2025-09-12 18:42:44 ，仅供参考。
