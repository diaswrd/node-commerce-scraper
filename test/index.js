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
            images: '#gallery .carousel-item > a',
            name: 'h1.product-name',
            description: 'p.product-information-description',
            price: '.catalog-detail-full-price .catalog-detail-price-value'
        };

        scraper.get(url, options, function (err, data, $) {
            data.should.be.ok;

            data.images.should.be.an.Array;
            data.images.length.should.be.eql(4);

            data.name.should.be.a.String;
            data.name.should.be.eql('Camiseta Lee Vermelha');

            data.description.should.be.a.String;

            data.price.should.be.a.Number;
            data.price.should.be.eql(119);

            done();
        });

    });

    it('should work with objects and selector strings', function (done) {

        var url = 'http://www.zattini.com.br/produto/sapatenis-polo-hpc-190-D93-0005-010';

        var options = {
            images: {
                selector: '.photo-gallery-wrapper ul.photo-gallery-list li a[data-zoom]',
                attribute: 'data-zoom'
            },
            name: 'h1.base-title',
            description: 'div.product-description',
            price: '.product-info-holder [itemprop="price"]'
        };

        scraper.get(url, options, function (err, data, $) {
            data.should.be.ok;

            data.images.should.be.an.Array;
            data.images.length.should.be.eql(5);

            data.name.should.be.a.String;
            data.name.should.be.eql('Sapat&#xEA;nis Polo HPC 190');

            data.description.should.be.a.String;

            data.price.should.be.a.Number;
            data.price.should.be.eql(239.9);

            done();
        });

    });

});