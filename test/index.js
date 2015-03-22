var should = require('should');
var scraper = require('../index');

describe('Node e-commerce scraper', function () {

    it('should get an e-commerce url and return the html', function (done) {

        scraper.get('http://www.google.com', function (err, $) {
            $.should.be.ok;

            $('body').length.should.be.above(0);

            done();
        });

    });

    it('should return a valid list of product attributes', function (done) {

        var url = 'http://www.dafiti.com.br/Camiseta-Lee-Vermelha-1680307.html';

        var options = {
            images: '#gallery .gallery-preview img.gallery-preview-img',
            name: 'h1.product-name',
            price: '.catalog-detail-full-price .catalog-detail-price-value'
        };

        scraper.get(url, options, function (err, data, $) {
            data.should.be.ok;

            data.images.should.be.an.Array;
            data.images.length.should.be(4);

            data.name.should.be.a.String;
            data.name.should.be.eql('Camiseta Lee Vermelha');

            data.price.should.be.a.Number;
            data.price.should.be.eql(119);

            done();
        });

    });

});