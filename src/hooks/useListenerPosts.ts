import {useEffect} from "react";
import firebase from "firebase";
import {useDispatch} from "react-redux";
import {PostType, setPosts} from "../redux/reducers/user-reducer";

export const useListenerPosts = (id: string) => {
    const dispatch = useDispatch()
    useEffect(() => {
        if(id) {
            firebase.firestore().collection('users').doc(id).collection('posts')
                .onSnapshot(posts => {
                    const allPosts = posts.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as PostType[]
                    dispatch(setPosts(allPosts))
                })
        }
    }, [id]);

}
