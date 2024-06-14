const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
  const { titile } = req.body;
  const image = req.file.filename;

  //console.log(req.body);
  const reqUser = req.User;

  const user = await User.findById(reqUser._id);

  //Create a photo - criar foto
  const newPhoto = await Photo.create({
    image,
    titile,
    userId: user._id,
    userName: user.name,
  });

  //If user was created successfully, return data - Se o usuário foi criado com sucesso, retorne os dados
  if (!newPhoto) {
    res.status(422).json({
      erros: ["Houve um problema, por favor tente novamente mais tarde!"],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

///Remove a photp from DB - remover uma foto do banco de dados
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(mongoose.Types.Object(id));

    //check if photo exists - veririque se a foto existe
    if (!photo) {
      res.status(404).json({ erros: ["foto não encontrada!"] });
      return;
    }
    //Check is photo belongs to user - verifique se a foto pertence ao usuário
    if (!photo.userId.equals(reqUser.id)) {
      res.status(422).json({
        erros: ["Ocorreu um erro, por favor tente navamente mais tarde."],
      });
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluida com sucesso." });
  } catch (error) {
    res.status(404).json({ erros: ["foto não encontrada!"] });
    return;
  }
};

// Get all photos - Obtenha todas as fotos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();
  return res.status(200).json(photos);
};

//Get user photos
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createAt", -1]])
    .exec();
  return res.status(200).json(photos);
};

// Get phot by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(mongoose.Types.objectId(id));

  // check if photo exist
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada"] });
    return;
  }

  res.status(200).json(photo);
};

// Update a photo
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  // Check if photo exists
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada"] });
    return;
  }

  // Check if photo belongs to user
  if (!photo.userId.equals(reqUser._id)) {
    res.status(422).json({
      erros: ["Ocorreu um erro, por favor tente novamente mais tarde."],
    });
    return;
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

// Like functionality
const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  // Check if photo exists
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada"] });
    return;
  }

  // Check se user already liked the photo
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ erros: ["você já curtiu a foto."] });
    return;
  }

  // Put user id in likes array
  photo.likes.push(reqUser._id);

  photo.save();

  res
    .status(200)
    .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida." });
};

// comment functionality
const commentPhoto = async (req, res) => {
  const { id } = req.params;

  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  // Check if photo exists
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada"] });
    return;
  }

  // Put comment in the array comments
  const userComment = {
    comment,
    username: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };


  photo.comment.push(userComment)

  await photo.save()

  res.status(200).json({
    comment: userComment,
    message: "O comentário foi adicionado com sucesso!"
  })

};

// Search photos by title
const searchPhotos = async(req, res) => {

  const {q} = req.query

  const photos = await Photo.find({title: new RegExp(q, "i")}).exec()

  res.status(200).json(photos);

}


module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
