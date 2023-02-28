import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import RecipePost from "../../components/recipe_posts/RecipePost";
import Navbars from "../../components/navbars/Navbars";
import PostModal from "../../components/postModal/postModal";
import "./ProfilePage.css";
import { useAuth } from "../../contexts/AuthContext";
// import { useParams } from "react-router-dom";


// import renderRecipePostComponents from "./pages/HomePage/HomePage";
//FIXME: ProfilePage is very similar to HomePage code so probably a way to re-use

function ProfilePage() {
    const [profileRecipePostsList, updateProfileRecipePostsList] = useState([]);
    const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
    const { currentUser } = useAuth();
    const username = currentUser.displayName;


    //useAuth has information from Firebase about user, we will get userId from here
    /*
  This will fetch the list of PROFILE recipe posts stored in the database 
  as an array of json objects. It will then save it in the state variable profileRecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_PROFILE_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */
    const URL_GET_PROFILE_RECIPE_POSTS_DATA = "/api/recipe/all";
    const URL_GET_USERS_FRIEND_REQUESTS = `/api/user/friend-requests/${currentUser.uid}`;

    console.log("Current User: ", currentUser);
    useEffect(() => {
        fetch(URL_GET_PROFILE_RECIPE_POSTS_DATA)
            .then((response) => response.json())
            .then((data) => updateProfileRecipePostsList(data));

        fetch(URL_GET_USERS_FRIEND_REQUESTS)
            .then((response) => response.json())
            .then((data) => setReceivedFriendRequests(data));
    }, []);

    function renderProfileRecipePostComponents() {
        const arrComponents = [];
        for (let i = 0; i < profileRecipePostsList.length; i++) {
            if (profileRecipePostsList[i].uid === currentUser.uid) {

                console.log("This is the recipe in Profile Page", profileRecipePostsList[i])
                arrComponents.unshift(
                    <RecipePost
                        key={i}
                        recipe={profileRecipePostsList[i]}
                    />
                );
            }
        }
        if (arrComponents.size === 0) {
            return (
                <h1 style={{ color: "blue", fontSize: "60px" }}>You currently do not have posts</h1>
            );
        } else {
            return arrComponents;
        }
    }

    function reloadFriendReqs(){
        fetch(URL_GET_USERS_FRIEND_REQUESTS)
            .then((response) => response.json())
            .then((data) => setReceivedFriendRequests(data));
    }

    function acceptFriend(senderId){
        const URL_ACCEPT_FRIEND_REQUEST = `/api/user/friend-accept/${currentUser.uid}/${senderId}`;
        const response = fetch(URL_ACCEPT_FRIEND_REQUEST, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            console.log(data);
            reloadFriendReqs();
        });

        console.log(response);

    }

    let receivedFriendReqDisplay;
    receivedFriendReqDisplay = receivedFriendRequests.map((friendReq) => (
        <div className="friendRequest" key={friendReq.uid}>{friendReq.profile.displayName || friendReq.email}
            <span className="rec-friend-req-btn bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={() => acceptFriend(friendReq.uid)}
            >
                Accept</span>
        </div>
    ));
    //have user info at top
    return (
        <div>
            <Navbars />
            <Container>
            <img src={currentUser?.photoURL}
            className={"bioProfilePic"}
            alt="No-Pic"/>
            <div className={"bioProfileName"}>
            {username ? username : "No username"}
            </div>
            <div className="rec-friend-req-container">
                    {receivedFriendRequests.length !== 0 && (
                        receivedFriendReqDisplay
                    )}
            </div>
            </Container>
            <div className="profile-page">
                <PostModal></PostModal>
                <ul>{renderProfileRecipePostComponents()}</ul>
            </div>
        </div>
    );
}

export default ProfilePage;
