US Interactive Template
========================

An alternative template and toolchain for creating interactive atoms for the Guardian. Designed purposely to be light and not encumber the developer with too much. It uses SASS for CSS, Rollup for JS and Handlebars for HTML.

## Requirements

[Node JS](https://github.com/creationix/nvm) Version 8.0.0 or above. Works with 11.4.0

## Installation

Get dependencies by running `npm install`.

## Usage

* `npm run start` to watch for changes and serve on [http://localhost:8080/main.html](http://localhost:8080/main.html).
* `npm run deploy -- BUILD` to deploy. `BUILD` is either `live` or `preview` environments. You'll need AWS credentials obtained through Janus to be able to deploy successfully.
* `npm run log -- BUILD` to check the server logs after an upload.

## Data

To pass data from a spreadsheet, share the google spreadsheet with `api-884@what-you-need-to-know.iam.gserviceaccount.com`
