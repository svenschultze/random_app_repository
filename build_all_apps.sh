for app in apps/*; do
    app=$(echo $app | sed 's/apps\///')
    echo "Building $app"
    docker run --rm -it -v ./apps/$app:/app -w /app node bash -c "npm i && npm i vue-voix@0.0.3 && npm run build"
    echo "Done building $app. Copying dist folders to dist/$app"
    # now create a dist folder for each app. remove the apps/ prefix
    mkdir -p dist/$app
    cp -r ./apps/$app/dist/. dist/$app
    echo "Done copying dist folders to dist/$app"
done
