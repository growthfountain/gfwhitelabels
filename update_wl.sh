#!/usr/bin/env bash
git fetch -q --all
git checkout alpha > /dev/null
for b in alpha-dcu alpha-momentum3 alpha-rivermarkcu alpha-jdcu alpha-infinityfcu
do
    echo "========================= branch $b =========================="
    git checkout $b
    git pull origin $b
    git submodule update --init
    cd consts && git checkout master && git pull origin alpha 
    cd ..
    cd staticdata && git checkout `git rev-parse --abbrev-ref HEAD` && git pull 
    cd ..

    if git branch --all | grep --quiet "remotes/vladyslav2/$b"; then
        echo "============ MERGE WITH VLADYSLAV/$b ============"
        git merge vladyslav2/$b > /dev/null
    fi

    git merge --no-ff alpha > /dev/null
    ./fix_merge.sh

    if git st | grep --quiet 'UU '; then
        echo "Error after merge"
        git st | grep 'UU '
        break;
    else
        git push origin $b
        # Push in the main repositary will not work
        # if git branch --all | grep --quiet "remotes/vladyslav2/$b"; then
        #    git push origin vladyslav/$b
        # fi
        echo "Succesfull merged AND PUSHED $b"
    fi
    echo ""

done

git checkout alpha
