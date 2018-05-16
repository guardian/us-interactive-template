US Interactive Template
========================

An alternative templates and toolchain for creating interactive atoms for the Guardian

## Installation

Get dependencies by running `npm install`.

## Usage

* `npm run start` to watch for changes and serve on [http://localhost:8080/main.html](http://localhost:8080/main.html).
* `npm run deploy -- BUILD` to deploy. `BUILD` is either `live` or `preview` environments. You'll need AWS credentials obtained through Janus to be able to deploy successfully.
* `npm run log -- BUILD` to check the server logs after an upload.