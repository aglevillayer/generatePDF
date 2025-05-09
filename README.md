# generatePDF

API to generate a PDF file from an url

## Dependencies

In order to work on the project, you should fetch backend dependencies. You may run **from the root**:

```
npm i
```

## Running the app

From the root, run

```
docker compose up --build
```

## Branches naming convention

All branches must start with either:

- `feature/` to develop a new feature
- `improvement/` to develop an improvement of an existing feature
- `bug/` to fix a bug
- `upgrade/` to handle big refactorization of framework updates

After this prefix, your banch name should contain only lower case letters and dashes.

## Git flow

For each task, a new branch should be opened. When the work is ready to be merged, a merge request (MR) should be openeded between this new branch and the `dev` one.

Later, when the `dev` branch is ready to go in production, a merge request between `dev` and `main` is created and merged.

## Using the app

The route to download a pdf is /api/pdf at which you must pass a token.
The token will be a JSON object containing the url to pdf, and options as pagination, header or footer. You may pass HTML to header and footer fields.
This token will be stringified, encrypted and finally coded to be given to API.
