let papersData = [{
  author: 'Brittany',
  title: 'Lorem Ipsum',
  footnotes: ['one', 'two', 'three']
},
{
  author: 'Robbie',
  title: 'Dolor Set Amet',
  footnotes: ['four', 'five', 'six']
},
{
  author: 'Will',
  title: 'Making Cider',
  footnotes: ['bubbles are exciting']
}]

const createPaper = (knex, paper) => {
  return knex('papers').insert({
    title: paper.title,
    author: paper.author,
  }, 'id')
  .then(paperIds => {
    let footnotePromises = paper.footnotes.map(note => {
      return createFootnote(knex, {
        note,
        paper_id: paperIds[0]
      })
    })

    return Promise.all(footnotePromises)
  })
}

const createFootnote = (knex, footnote) => {
  return knex('footnotes').insert(footnote)
}

// make new exports.seed
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('footnotes').del()
    .then(() => knex('papers').del())
    .then(() => {
      let paperPromises = papersData.map(paper => {
        return createPaper(knex, paper)
      })

      return Promise.all(paperPromises)
    })
    .then(() => console.log('Successfully seeded db'))
    .catch(error => console.log(`Error seeding db: ${error.message}`))
};

