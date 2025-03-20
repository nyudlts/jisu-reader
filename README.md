NYU Press Reader

```
git fetch readium-playground PreferencesAPI-migration
git checkout readium-playground/PreferencesAPI-migration

git submodule update --remote
git submodule sync --recursive
git submodule update --remote --recursive

git merge readium-playground/PreferencesAPI-migration
```