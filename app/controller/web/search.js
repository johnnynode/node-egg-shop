'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {
    // 在增加商品的时候，需要把数据同步到es，搜索的时候接入es, 这样搜索会更快
    // 下面的news索引是之前建好的，可以结合elasticsearch-heard来测试
    async index() {
        // 测试的时候，逐个代码展开测试 如下：

        //增加数据
        // await this.add();

        //修改数据
        // await this.edit();

        // 搜索数据
        // await this.query();

        // 分页搜索数据
        // await this.pager();

        // 统计数据
        // await this.count();

        // 删除数据
        // await this.delete();
    }

    async add() {
        let addResult = await this.app.elasticsearch.bulk({
            body: [
                { index: { _index: 'news', _id: '111111111111111111' } },
                { content: 'es-add-test' }
            ]
        });
        console.log('add: ', addResult);
        this.ctx.body = 'add test';
    }

    async edit() {
        let editResult = await this.app.elasticsearch.bulk({
            body: [
                { update: { _index: 'news', _id: '111111111111111111' } },
                { doc: { content: '使用ARM芯片的Mac将可能在2020年推出666' } },
            ]
        });
        console.log('editResult: ', editResult);
        this.ctx.body = 'update test';
    }

    async query() {
        // 相关文档：https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/search_examples.html
        let result = await this.app.elasticsearch.search({
            index: 'news',
            body: {
                query: {
                    match: {
                        content: '666'
                    }
                }
            }
        });
        console.log('queryResult: ', JSON.stringify(result));
        this.ctx.body = 'query test';
    }

    async pager() {
        let page = 1;
        let pageSize = 2;
        let result = await this.app.elasticsearch.search({
            index: 'news',
            from: (page - 1) * pageSize, //skip
            size: pageSize,
            body: {
                query: {
                    match: {
                        content: '666'
                    }
                }
            }
        });
        console.log('pagerResult: ', JSON.stringify(result));
        this.ctx.body = 'pager test';
    }

    async count() {
        let result = await this.app.elasticsearch.count({
            index: 'news',
            type: 'doc',
            body: {
                query: {
                    match: {
                        content: '666'
                    }
                }
            }
        });


        console.log(result);
        this.ctx.body = 'count test';
    }

    async delete() {
        let result = await this.app.elasticsearch.bulk({
            body: [
                { delete: { _index: 'news', _id: '111111111111111111' } },
            ]
        });
        console.log('deleteResult: ', result);
        this.ctx.body = 'delete test';
    }
}

module.exports = SearchController;