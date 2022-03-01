import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import {v4 as uuidv4} from 'uuid';
import {MediaTypeValue} from "expo-media-library";
import FieldValue = firebase.firestore.FieldValue;
import {CurrentUserInfo, PostType} from "../redux/reducers/user-reducer";


if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyCZ2wd64Xt01l_Wgn82sFf5giU_taZuFnY",
        authDomain: "instagram-native-acb0c.firebaseapp.com",
        projectId: "instagram-native-acb0c",
        storageBucket: "instagram-native-acb0c.appspot.com",
        messagingSenderId: "361313937039",
        appId: "1:361313937039:web:0170d48a622c26f361b2fa"
    });
} else {
    firebase.app();
}

const storageRef = firebase.storage().ref()


export const authAPI = {
    signUp: (email: string, password: string, username: string, fullName: string) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password).then(snapshot => {
            if (snapshot.user) {
                actionsAPI.setCollectionUser(fullName, snapshot.user.uid, email, username).then(r => r)
            }
        })
    },
    signIn: (email: string, password: string) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    signOut: () => {
        return firebase.auth().signOut()
    }
}

export type PublishPostType =
    { id: string, caption: string, media: { type: MediaTypeValue, src: string, duration?: string } }
    & { cb?: () => void }
type updateProfileKeys = 'username' | 'fullName' | 'aboutSelf' | 'id'
export type UpdateProfile = { [key in updateProfileKeys]: string } & { photo: string | null }
export const actionsAPI = {
    publishPost: async ({id, media, caption}: PublishPostType) => {
        const response = await fetch(media.src)
        const blob = await response.blob()
        const upload = await storageRef.child(`${media.type === 'photo' ? 'images' : 'videos'}/${uuidv4()}`).put(blob);
        const src = await upload.ref.getDownloadURL()
        return firebase.firestore().collection('users').doc(id).collection('posts').doc().set({
            caption,
            media: {type: media.type, src, duration: media.duration},
            dateCreated: firebase.firestore.Timestamp.now().seconds,
            likes: [],
            comments: []
        })
    },
    setCollectionUser: (name: string, id: string, email?: string, username?: string) => {
        return firebase.firestore().collection('users').doc(id).set({
            fullName: name,
            followers: [],
            following: [],
            email,
            username,
            id: id,
            aboutSelf: '',
            photo: ''
        }, {merge: true}).then(r => r)
    },
    setNameUser: (name: string, id: string, aboutSelf = '') => {
        const promiseAll = []
        if (!!name) {
            const response = firebase.firestore().collection('users').doc(id).update({
                fullName: name,
            })
            promiseAll.push(response)
        }
        if (!!aboutSelf) {
            const response = firebase.firestore().collection('users').doc(id).update({
                aboutSelf
            })
            promiseAll.push(response)
        }
        return promiseAll
    },
    getCollectionUserInfo: (id: string) => {
        return firebase.firestore().collection('users').doc(id).get().then(snapshot => snapshot.data())
    },
    getFullCollectionUserInfo: async (id: string) => {
        const info = await firebase.firestore().collection('users')
            .doc(id).get().then(snapshot => snapshot.data()) as CurrentUserInfo
        const {docs} = await firebase.firestore().collection('users')
            .doc(id).collection('posts').get()
        const posts = docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PostType[]
        return {...info, posts}
    },
    updateProfile: async ({photo, fullName, aboutSelf, username, id}: UpdateProfile) => {
        let src = null
        let promiseAll = []
        if (!!photo) {
            const response = await fetch(photo)
            const blob = await response.blob()
            const upload = await storageRef.child(`images/${uuidv4()}`).put(blob);
            src = await upload.ref.getDownloadURL()
        }
        if (src) {
            const collectionUser = firebase.firestore().collection('users').doc(id).update({
                photo: src
            })
            promiseAll.push(collectionUser)
        }
        if (!!username) {
            const collectionUser = firebase.firestore().collection('users').doc(id).update({
                username
            })
            promiseAll.push(collectionUser)
        }
        if (!!fullName || !!aboutSelf) {
            const response = actionsAPI.setNameUser(fullName, id, aboutSelf)
            promiseAll.push(...response)
        }
        return Promise.all(promiseAll)
    },
    toggleLike: (like: boolean, currentUserId: string, postId: string) => {
        return firebase.firestore().collection('users').doc(currentUserId).collection('posts').doc(postId).update({
            likes: like ? FieldValue.arrayRemove(currentUserId) : FieldValue.arrayUnion(currentUserId)
        })
    }
}
