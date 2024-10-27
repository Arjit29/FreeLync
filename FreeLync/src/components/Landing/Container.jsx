import React from "react";
import "./Container.css"

export default function Container({backgroundColor,height,width,imageURL,imageHeight,imageWidth,text,marginTop,isLeft,children}){
    return(
        <div className="container" style={{backgroundColor: backgroundColor,height: height,width: width}}>
            {isLeft ? (
                <>
                    <div className="image" style={{ backgroundImage: `url(${imageURL})`, height: imageHeight, width: imageWidth,marginTop: marginTop}}></div>
                    <div className="text">
                        <h1 className="typing-text">{text}</h1>
                    </div>
                </>
            ) : (
                <>
                <div className="text">
                    <h1 className="typing-text">{text}</h1>
                </div>
                <div className="image" style={{ backgroundImage: `url(${imageURL})`, height: imageHeight, width: imageWidth,marginTop: marginTop}}></div>
                </>
            )}

            <div className="button-wrapper">
                {children}
            </div>
        </div>
    )
}