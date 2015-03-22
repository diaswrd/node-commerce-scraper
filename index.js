var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');

var Scraper = function () {
    this.currency = 'R$';
    this.decimalMark = ',';
};

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
        var data = {};

        this.getHtml(url, function (err, $) {
            if (err) {
                callback(err);
                return;
            }

            _.each(attributes, function (selector, key) {
                var $item = $(selector);

                if ($item.is('img')) {
                    data[key] = $item.attr('src');
                    return;
                }

                if ($item.is('a')) {
                    data[key] = $item.attr('href');
                    return;
                }

                var text = _.trim($item.html());

                if (text.indexOf(this.currency) != -1) {
                    var value = text.replace(this.currency, '').replace(this.decimalMark, '.');
                    data[key] = parseFloat(value);
                    return;
                }

                if (isNaN(text)) {
                    data[key] = text;
                    return;
                }

                data[key] = parseFloat(text);
            }.bind(this));

            callback(null, data, $);
        }.bind(this));
    }

};

exports = module.exports = new Scraper();