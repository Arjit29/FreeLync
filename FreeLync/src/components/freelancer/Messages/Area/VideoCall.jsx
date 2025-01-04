import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

export default function VideoCall({ userId, receiverId }) {
  const socket = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        socket.current.on("incoming_call", ({ from, offer }) => {
          const peer = new Peer({ initiator: false, trickle: false, stream });
          peerRef.current = peer; // Ensure peer is saved in the ref

          peer.on("signal", (data) => {
            socket.current.emit("answer_call", { to: from, answer: data });
          });

          peer.on("stream", (partnerStream) => {
            partnerVideo.current.srcObject = partnerStream;
          });

          peer.signal(offer);
        });
      });

    socket.current.on("ice_candidate", ({ candidate }) => {
      if (peerRef.current) {
        peerRef.current.addIceCandidate(candidate);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [receiverId]);

  const startCall = () => {
    setIsCalling(true);
    const peer = new Peer({ initiator: true, trickle: false, stream: userVideo.current.srcObject });
    peerRef.current = peer; // Ensure peer is saved in the ref

    peer.on("signal", (data) => {
      socket.current.emit("call_user", { to: receiverId, offer: data });
    });

    peer.on("stream", (partnerStream) => {
      partnerVideo.current.srcObject = partnerStream;
    });

    socket.current.on("call_answered", ({ answer }) => {
      peer.signal(answer);
    });
  };

  return (
    <div className="video-call-container">
      <video ref={userVideo} autoPlay muted></video>
      <video ref={partnerVideo} autoPlay></video>
      {!isCalling && <button onClick={startCall}>Start Call</button>}
    </div>
  );
}
