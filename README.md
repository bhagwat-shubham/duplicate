# Google GPS Document AI Demos

TODO: Write about project

## Local Development

You must have Node v12+ installed. Then run the following commands:

```bash
npm ci
npm run dev
```

To build a production version you can run:

```bash
npm run build
```

A `build` directory will be created with the built assets.

### Docker
You can develop with docker with the following commands

```bash
docker build -t docai .
docker run --rm -p 8080:8080 --name docai docai
```

To build a production version you can run:

```bash
docker build -t docai .
docker run --name docai docai npm run build
```

And then copy the built files out of the container with:

```bash
docker cp docai:/app/build ./
```