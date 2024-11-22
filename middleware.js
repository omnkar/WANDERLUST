const Listings=require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
    module.exports.isLoggedIn=(req,res,next)=>
    {

        if(!req.isAuthenticated())
            {
                req.session.redirectUrl=req.originalUrl;
                req.flash("error","you must be logged in to create listings");
                return res.redirect("/login");
            }
            next();
    }

    module.exports.saveRedirectUrl=(req,res,next)=>
    {
        if(req.session.redirectUrl)
        {
            res.locals.redirectUrl=req.session.redirectUrl;
        }
        next();
    }

    module.exports.isOwner=async(req,res,next)=>
    {
        let {id}=req.params;
        //console.log(id);
        let listing=await Listings.findById(id);
        //console.log(listing.owner._id+" "+res.locals.currUser._id );
        if(!listing.owner._id.equals(res.locals.currUser._id))
        {
            
            req.flash("error","You are not the owner of this listings");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }
    module.exports.validateListing=(req,res,next)=>
        {
            let {error}=listingSchema.validate(req.body);
                if(error)
                {
                    let errMsg=error.details.map((el)=>el.message).join(",");
                    throw new ExpressError(400,errMsg);
                }
                else{
                    next();
                }
        
        }
    module.exports.validateReview=(req,res,next)=>
            {
                let {error}=reviewSchema.validate(req.body);
                if(error)
                {
                    let errMsg=error.details.map((el)=>el.message).join(",");
                    throw new ExpressError(400,errMsg);
                }
                else{
                    next();
                }
            }

    module.exports.isReviewAuthor=async(req,res,next)=>
    {
        let {id,reviewId}=req.params;
        //console.log(id);
        let review=await Review.findById(reviewId);
        //console.log(listing.owner._id+" "+res.locals.currUser._id );
        if(!review.author._id.equals(res.locals.currUser._id))
        {
            
            req.flash("error","You are not the author of this listings");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }