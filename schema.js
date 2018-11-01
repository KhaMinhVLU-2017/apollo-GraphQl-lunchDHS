var Foods = require('./api/model/food')
var {gql, PubSub} = require('apollo-server')
const ObjectId = require('mongoose').Types.ObjectId
ObjectId.prototype.valueOf = function () {
	return this.toString()
}
const pubsub = new PubSub()

const typeDefs = gql`
    type Food {
        title: String
        price: Int
        unit: String
        _id: ID
    }
    type Subscription {
        foodAdded: String
    }
    type Query {
        getfoods: [Food]
        food(_id: ID!): Food
    }
    type Mutation {
        addFood(title: String!, price: Int!, unit: String!): Food
        rmFood(_id: ID!): Food
    }
`
const resolvers = {
    Query: {
        getfoods: () => Foods.find({}),
        food: (root, args, context, info) => Foods.findById(args._id)
    },
    Mutation: {
        addFood:(root, args) => {
            let title = args.title
            let price = args.price
            let unit = args.unit
            var food = new Foods({title, price, unit, food})
            food.save()
            pubsub.publish('langngheseve', { foodAdded: 'Da lu xuong thanh cong' });
            return food
        },
        rmFood:(root, args) => {
            let _id = args._id
            console.log("Delete complete " + _id)
            return Foods.deleteOne({_id})
        }
    },
    Subscription: {
        foodAdded: {
            subscribe: () => pubsub.asyncIterator(['langngheseve']),
        }
    }
}

module.exports = {typeDefs, resolvers}