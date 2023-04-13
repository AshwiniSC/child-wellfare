const Hapi = require('@hapi/hapi');

const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  await server.register({
    plugin: require('hapi-mongodb'),
    options: {
      url: 'mongodb+srv://child_wellfare:2RgFfEBTJo9eRGqT@child-wellfare.lyfamhy.mongodb.net/test?retryWrites=true&w=majority',
      settings: {
          useUnifiedTopology: true
      },
      decorate: true
    }
  });

  // Get all users
  server.route({
    method: 'GET',
    path: '/users',
    handler: async (req, h) => {
      const offset = Number(req.query.offset) || 0;
      try{
        const childs = await req.mongo.db.collection('childs').find({}).sort({metacritic:-1}).skip(offset).limit(20).toArray();
        return {status: true, data:childs, message: "Get all childs"};
      }catch(err){
        return {status: false, data:[], message: "Something went wrong"};
      }
    }
  });

  // Add a new user to the database

  server.route({
    method: 'POST',
    path: '/users',
    handler: async (req, h) => {
      let payload = req.payload
      payload.isDelete = false
      try{
        const user = await req.mongo.db.collection('childs').insertOne(payload);
        return {status: true, data:user, message: "Add new child"};
      }catch(err){
        return {status: false, data:{}, message: "Something went wrong."};
      }
      
    }
  });

  // Get a single user
  server.route({
    method: 'GET',
    path: '/users/{id}',
    handler: (req, h) => {
      return 'Return a single user';
    }
  });

  // Update the details of a user
  server.route({
    method: 'PUT',
      path: '/users/{id}',
      handler: async (req, h) => {
        const id = req.params.id
        const ObjectID = req.mongo.ObjectID;
        const payload = req.payload
        try{
          const user = await req.mongo.db.collection('childs').findOneAndUpdate({_id: ObjectID(id)}, {$set:{child_name:payload.child_name}}, {new: true})
          return {status: true, data:user, message: "Update child"};
        }catch(err){
          return {status: false, data:{}, message: "Something went wrong."};
        }
      }
  });

  // Delete a user from the database
  server.route({
      method: 'DELETE',
      path: '/users/{id}',
      handler: async (req, h) => {
        const id = req.params.id
        const ObjectID = req.mongo.ObjectID;
        try{
          const data = await req.mongo.db.collection('childs').deleteOne({_id: ObjectID(id)});
          return {status: true, data:data, message: "Delete child data"};
        }catch(err){
          return {status: false, data:{}, message: "Something went wrong."};
        }
      }
  });

  // Search for a user
  server.route({
      method: 'GET',
      path: '/search',
      handler: (req, h) => {

          return 'Return search results for the specified term';
      }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
}

init();  