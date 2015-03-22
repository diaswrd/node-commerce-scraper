var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');

var Scraper = function () {};

Scraper.prototype = {

    get: function (url, options, callback) {
        if (!callback && _.isFunction(options)) {
            callback = options;

            this.getHtml(url, callback);
            return;
        }

        this.getProductData(url, options, callback);
    },

    getHtml: function (url, callback) {
        request(url, function (err, response, html) {
            if (err) {
                callback(err);
                return;
            }

            var $ = cheerio.load(html);

            callback(null, $);
        });
    },

    getProductData: function (url, attributes, callback) {
        callback();
    }

};

exports = module.exports = new Scraper();