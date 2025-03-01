
#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# create a .nojekyll file to bypass GitHub Pages Jekyll processing
touch .nojekyll

# Make sure GitHub Pages properly identifies .mjs files
echo "*.mjs linguist-language=JavaScript" > .gitattributes

# Create SPA redirects file
echo "/* /index.html 200" > _redirects

# initialize git in the dist directory
git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:miamicrypto/mealmaple-nourishflow.git main:gh-pages

cd -
