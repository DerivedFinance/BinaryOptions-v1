import React from 'react';
import './skeletonLoading.css';

const SkeletonLoading = () => {
    return(
        <div className="skeleton-card">
            <div className="header">
                <div className="title">
                    <div className="img"></div>
                    <div className="details">
                    <span className="name"></span>
                    </div>
                </div>
                <div className="btns">
                    <div className="btn btn-1"></div>    
                </div>
            </div>
            <div className="description">
                <div className="line line-1"></div>
            </div>
            <div className="btns">
                <div className="btn btn-2"></div>
            </div>
        </div>
    )
}
export default SkeletonLoading; 