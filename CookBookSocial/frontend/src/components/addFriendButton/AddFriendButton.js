import React, { useEffect, useState } from "react";
import CancelFriendRequest from "../cancelFriendRequest/cancelFriendRequest";
import FriendRequestControl from "../FriendRequestControl/FriendRequestControl";
import UnfriendButton from "../unfriendButton/UnfriendButton";
import '../friendRequestsDisplay/FriendRequestsDisplay.css'

export default function AddFriendButton({ currentUserId, profileUid, profileInfo }) {

    // Friend states:
    const FRIEND = "friend";
    const UNKNOWN = "unknown";
    const REQUEST_SENT = "request sent";
    const REQUEST_RECEIVED = "request received";
    const NOT_FRIENDED = "not friended";
    const IS_CURRENT_USER = "is current user";
    const [friendedState, setFriendedState] = useState(UNKNOWN);

    useEffect(() => {
        
        if(profileUid === currentUserId){
            setFriendedState(IS_CURRENT_USER);
            return;
        }

        if(profileInfo && 'friends' in profileInfo){
            if(currentUserId in profileInfo['friends']){
                setFriendedState(FRIEND);
                return;
            } 
        } 
        if (profileInfo && 'receivedFriendRequests' in profileInfo){
            if (currentUserId in profileInfo['receivedFriendRequests']){
                setFriendedState(REQUEST_SENT);
                return;
            }
        }
        if (profileInfo && 'sentFriendRequests' in profileInfo) {
            if (currentUserId in profileInfo['sentFriendRequests']) {
                setFriendedState(REQUEST_RECEIVED);
                return;
            }
        }
        setFriendedState(NOT_FRIENDED);


    }, [profileInfo?.friends, profileInfo?.receivedFriendRequests, profileInfo?.sentFriendRequests]);

    const URL_SEND_FRIEND_REQUEST = `/api/user/friend-request/${currentUserId}/${profileUid}`;
    function addFriend() {

        setFriendedState(REQUEST_SENT);
        /*
            currentUser.uid is the user id of the current viewer/user.  userId is the id of the user profile that they are viewing.  Need both id's when making a friend request.  currentUser will have the other user id in their 'sentFriendRequests' list in firebase.  The profile being viewed will have the current user ID in their 'receivedFriendRequests' list in firebase.
        */

        const response = fetch(URL_SEND_FRIEND_REQUEST, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            console.log(data);
        });

        console.log(response);

    }

    function acceptFriend() {
        const URL_ACCEPT_FRIEND_REQUEST = `/api/user/friend-accept/${currentUserId}/${profileUid}`;
        setFriendedState(FRIEND);
        const response = fetch(URL_ACCEPT_FRIEND_REQUEST, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            console.log(data);

        });

        console.log(response);

    }

    function rejectFriend() {
        setFriendedState(NOT_FRIENDED);
        CancelFriendRequest(currentUserId, profileUid);

    }

    function cancelRequest(){
        setFriendedState(NOT_FRIENDED);
        CancelFriendRequest(profileUid, currentUserId);
    }

    if(friendedState === NOT_FRIENDED){
        return (
            <span
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => addFriend()}>
                Add Friend
            </span>
        )
    } else if (friendedState === UNKNOWN){
        return (
            <span>
                Loading...
            </span>
        )
    } else if (friendedState === REQUEST_RECEIVED){
        return (
            <span>
                <span className="rec-friend-req-btn text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                    onClick={() => acceptFriend()}
                >
                    Accept Friend Request</span>
                    <span className="rec-friend-req-btn text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => rejectFriend()}
                >
                    Reject</span>
            </span>
        )
    } else if (friendedState === REQUEST_SENT){
        return (

                <div className="rec-friend-cancel-btn text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => cancelRequest()}
                >
                    Cancel Friend Request
               </div>
        )
    } else if (friendedState === FRIEND){
        return (
            <UnfriendButton 
            currentUserId={currentUserId}
            profileUid = {profileUid}
            setFriendedState = {setFriendedState}
            />

        )
    } else if (friendedState === IS_CURRENT_USER){
        return(<span></span>);
    }

}

