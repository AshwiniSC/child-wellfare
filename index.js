const Hapi = require('@hapi/hapi');

const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: '127.0.0.1'
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


  //*******************************************************USERS******************************************************************//
  // Get all users
  server.route({
    method: 'GET',
    path: '/childs',
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
    path: '/childs',
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
    path: '/childs/{id}',
    handler: (req, h) => {
      return 'Return a single user';
    }
  });

  // Update the details of a user
  server.route({
    method: 'PUT',
      path: '/childs/{id}',
      handler: async (req, h) => {
        const id = req.params.id
        const ObjectID = req.mongo.ObjectID;
        const payload = req.payload
        try{
          const user = await req.mongo.db.collection('childs').findOneAndUpdate(
            { _id: ObjectID(id)}, 
            { $set: 
              {
                name:payload.name,
                age:payload.age,
                gender:payload.gender,
                activityInvolved:payload.activityInvolved,
                imageUrls:payload.imageUrls,
                videoUrls:payload.videoUrls,
                isDelete:payload.isDelete,
              }
            }, 
            { new: true}
          )
          return {status: true, data:user, message: "Update child"};
        }catch(err){
          return {status: false, data:{}, message: "Something went wrong."};
        }
      }
  });

  // Delete a user from the database
  server.route({
      method: 'DELETE',
      path: '/childs/{id}',
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

  //*************************************************WELFARE ASSOCIATION******************************************************************//

  // Add a new welfare association to the database
  server.route({
    method: 'POST',
    path: '/associations',
    handler: async (req, h) => {
      let payload = req.payload
      payload.isDelete = false
      try{
        const user = await req.mongo.db.collection('associations').insertOne(payload);
        return {status: true, data:user, message: "Add new association."};
      }catch(err){
        return {status: false, data:{}, message: err.message};
      }
      
    }
  });

  // Get all associations
  server.route({
    method: 'GET',
    path: '/associations',
    handler: async (req, h) => {
      const offset = Number(req.query.offset) || 0;
      try{
        const associations = await req.mongo.db.collection('associations').find({}).sort({metacritic:-1}).skip(offset).limit(20).toArray();
        return {status: true, data:associations, message: "Get all associations"};
      }catch(err){
        return {status: false, data:[], message: "Something went wrong."};
      }
    }
  });

  // Update the details of a association
  server.route({
    method: 'PUT',
      path: '/associations/{id}',
      handler: async (req, h) => {
        const id = req.params.id
        const ObjectID = req.mongo.ObjectID;
        const payload = req.payload
        try{
          const user = await req.mongo.db.collection('associations').findOneAndUpdate({_id: ObjectID(id)}, {$set:{association_name:payload.association_name}}, {new: true})
          return {status: true, data:user, message: "Update association"};
        }catch(err){
          return {status: false, data:{}, message: "Something went wrong."};
        }
      }
  });

  // Delete a association from the database
  server.route({
      method: 'DELETE',
      path: '/associations/{id}',
      handler: async (req, h) => {
        const id = req.params.id
        const ObjectID = req.mongo.ObjectID;
        try{
          const data = await req.mongo.db.collection('associations').deleteOne({_id: ObjectID(id)});
          return {status: true, data:data, message: "Delete association data."};
        }catch(err){
          return {status: false, data:{}, message: "Something went wrong."};
        }
      }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
}

init();  