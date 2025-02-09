import {
  createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider,
} from 'firebase/auth';

import {
  auth,
  db,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  orderBy, query, doc, deleteDoc, updateDoc,
} from './fireBase.js';

// funcion para registro de usuario mediante formulario
export const registerNewUser = (email, password) => new Promise((resolve, reject) => {
  createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;
    resolve(user.uid);
  }).catch((error) => {
    const errorCode = error.code;
    if (errorCode === 'auth/email-already-in-use') {
      reject(new Error('Ya existe este email'));
    } else if (errorCode === 'auth/weak-password') {
      reject(new Error('Contraseña inválida minino 6 caracteres'));
    } else if (errorCode) {
      reject(new Error('Correo inválido intenta de nuevo'));
    }
  });
});

// funcion para loguearse de cuenta mediante cuenta de usuario
export const loginUser = (email, password) => new Promise((resolve, reject) => {
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    const user = userCredential.user;
    resolve(user.uid);
  }).catch((error) => {
    const errorCode = error.code;
    if (errorCode === 'auth/invalid-email') {
      reject(new Error('Usuario y/o Contraseña invalidas'));
    }
  });
});

// registro mediante Google
export const registerGoogle = (provider) => (
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user.uid;
      console.log(token);
      return user;
    }).catch((error) => {
      const errorCode = error.code;
      return errorCode;
    // const errorMessage = error.message;
    // const email = error.customData.email;
    // const credential = GoogleAuthProvider.credentialFromError(error);
    }));

// login por google
export const loginGoogle = (provider) => (
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user.uid;
      console.log(token);
      return user;
    }).catch((error) => {
      const errorCode = error.code;
      return errorCode;
      // const errorMessage = error.message;
      // const email = error.customData.email;
      // const credential = GoogleAuthProvider.credentialFromError(error);
    }));

// funcion para crear publicaciones

const postCollection = collection(db, 'posts');
export const createNewPost = (img, nameRest, loc, assm, clear, pri, categ, like, user) => {
  addDoc(postCollection, {
    img,
    nameRest,
    loc,
    assm,
    clear,
    pri,
    categ,
    like,
    user,
    date: Date.now(),
  });
};

// llamar la coleccion de manera ordenada
const q = query(postCollection, orderBy('date', 'desc'));

// mostrar publicaciones en tiempo real

export const querySnapshot = getDocs(q);

// imprime los post en tiempo real
export const paintRealTtime = (Callback) => (onSnapshot(q, Callback));

// eliminar post
export const deletePost = (id) => deleteDoc(doc(db, 'posts', id));

// actualizar datos del post
export const UpdatePost = (idPost, nombreRest, locali, Calfic, Limpieza, precio, categoria) => {
  const docRef = doc(db, 'posts', idPost);
  updateDoc(docRef, {
    nameRest: nombreRest,
    loc: locali,
    assm: Calfic,
    clear: Limpieza,
    pri: precio,
    categ: categoria,
  });
};

// actualiza likes
export const updateLikes = (idPost, likes) => {
  const docRef = doc(db, 'posts', idPost);
  updateDoc(docRef, {
    like: likes,
  });
};
