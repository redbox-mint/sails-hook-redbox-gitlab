#! /bin/bash
set -e
BUILD_TARGET="$2"
function buildAngularApp() {
  if [ "$BUILD_TARGET" == "dev" ]; then
    NG_BUILD_PREFIX=""
    if [ ! -z "$NG_BUILD_TEMP_OUTPUT" ]  && [ "$2" == "" ]; then
      NG_BUILD_PREFIX="--output-path=${NG_BUILD_TEMP_OUTPUT}/${1}"
    fi
    (node_modules/.bin/ng build $NG_BUILD_PREFIX --app=${1}) 
  else 
    (node_modules/.bin/ng build --app=${1} --output-hashing=none --extract-css true --sourcemaps false  --vendor-chunk false)
  fi
}

function setupImages() {
  RB_DIR="$1"
  IMAGE_DIR="assets/default/default/images/leaflet"
  SOURCE_DIR="${RB_DIR}/${IMAGE_DIR}"
  TARGET_DIR="../${IMAGE_DIR}"
  declare -a IMAGES=("marker-icon-2x.png" "marker-icon.png" "marker-shadow.png")
  mkdir -p "${TARGET_DIR}"
  for image in "${IMAGES[@]}"
  do 
    cp -rf "${SOURCE_DIR}/${image}" "${TARGET_DIR}/${image}"
  done
}

export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
  unset NPM_CONFIG_PREFIX
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
fi
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd angular-legacy
nvm i < .nvmrc && npm install --legacy-peer-deps
# Check if we have legacy's "shared"
RB_DIR="/opt/redbox-portal"
if [ ! -d "shared" ]; then
  if [ ! -d "/opt/redbox-portal" ]; then 
    if [ -d "../../redbox-portal" ]; then
      RB_DIR="../../redbox-portal"
    else 
      git clone https://github.com/redbox-mint/redbox-portal.git /tmp/rbportal
      RB_DIR="/tmp/rbportal" 
    fi
  fi
  cp -Rf ${RB_DIR}/angular-legacy/shared ./
  setupImages "$RB_DIR"
fi

if [ $# -ne 0 ]
  then
    echo "Bundling ${1}"
    buildAngularApp "$1"
else 
  ng2apps=( `find ./ -maxdepth 1 -mindepth 1 -type d -printf '%f '` )
  for ng2app in "${ng2apps[@]}"
  do
    if [ "$ng2app" != "shared" ]; then
      if [ "$ng2app" != "e2e" ]; then
        if [ "$ng2app" != "node_modules" ]; then
          echo "Bundling ${ng2app}"
          buildAngularApp "${ng2app}"
        fi
      fi
    fi
  done
fi


