'use strict'

const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost/teas', { logging: false });

const Tea = db.define('tea', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.INTEGER,
  category: Sequelize.ENUM('green', 'black', 'herbal')
}, {
    getterMethods: {
      dollarPrice() {
        return "$" + (this.price / 100).toFixed(2);
      }
    },
    hooks: {
      beforeCreate: (tea, options) => {
        tea.title = tea.title.split(' ').map(function (word) {
          return word[0].toUpperCase() + word.slice(1)
        }).join(' ');

      }
    }
  }
)

Tea.findByCategory = function (category) {
  return Tea.findAll({
    where: {
      category: category
    }
  })
}

Tea.prototype.findSimilar = function () {
  return Tea.findAll({
    where: {
      title: this.title
    }
  })
}


module.exports = { db, Tea };
