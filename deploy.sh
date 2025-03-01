
#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# create a .nojekyll file to bypass GitHub Pages Jekyll processing
touch .nojekyll

# add a special meta file to force proper MIME types on GitHub Pages
cat > _headers <<EOL
/*
  Content-Type: text/html; charset=UTF-8
/*.js
  Content-Type: text/javascript
/*.mjs
  Content-Type: text/javascript
/*.json
  Content-Type: application/json
EOL

# Create SPA redirects file
echo "/* /index.html 200" > _redirects

# initialize git in the dist directory
git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:miamicrypto/mealmaple-nourishflow.git main:gh-pages

cd -
