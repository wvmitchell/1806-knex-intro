
exports.up = function(knex, Promise) {
  return knex.schema.table('papers', function(table) {
    table.string('publisher')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('papers', function(table) {
    table.dropColumn('publisher')
  })
};
