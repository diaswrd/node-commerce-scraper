var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');

var Scraper = function () {
    /*
     * TODOs:
     * Get currency and decimal mark by parameters.
    */

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
        var curr = this.currency;
        var decimal = this.decimalMark

        this.getHtml(url, function (err, $) {
            if (err) {
                callback(err);
                return;
            }

            _.each(attributes, function (selector, key) {
                var $item = $(selector);

                if ($item.length > 1) {
                    data[key] = [];

                    _.each($item, function (item) {
                        data[key].push(
                            parseProductAttribute($(item), curr, decimal)
                        );
                    }.bind(this));

                    return;
                }

                data[key] = parseProductAttribute($item, curr, decimal);
            }.bind(this));

            callback(null, data, $);
        }.bind(this));
    }

};

// Private functions
var parseProductAttribute = function ($item, currency, decimalMark) {
    if ($item.is('img')) {
        return $item.attr('src');
    }

    if ($item.is('a')) {
        return $item.attr('href');
    }

    var text = _.trim($item.html());

    if (text.indexOf(currency) != -1) {
        var value = text.replace(currency, '').replace(decimalMark, '.');
        return parseFloat(value);
    }

    if (isNaN(text)) {
        return text;
    }

    return parseFloat(text);
};

// Expose Scraper module
exports = module.exports = new Scraper();