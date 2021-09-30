const productMethod = {}
const acc = require('../middlewares/accessControl');
const Product = require('../models/product.model');
const fs = require('fs');

async function getProduct(_fields) {
    try {
        return Product.findOne(_fields)
    } catch (error) {
        return false;
    }
}
function convertGallery(gallery) {
    if (gallery.length > 0) {
        let galleryObject = [];
        for (let gal of gallery) {
            galleryObject.push({
                filename: gal.filename,
                link: `/img/products/${gal.filename}`
            })
        }
        return galleryObject;
    }
    return []
}
function unlinkSyncGallery(gallery) {
    try {
        if (gallery.length > 0) {
            for (let value of gallery) {
                let ruta = value.link ? `${__dirname}/../../public${value.link}` : value.path;

                fs.unlinkSync(ruta);
            }
        }

        return true
    } catch (error) {
        return false
    }

}

productMethod.readProducts = async (req, res) => {

    /*const permission = acc.can(req.user.rol.name).readAny("product").granted;

    if (permission) {*/
    try {
        const products = await Product.find();

        if (products) {
            return res.status(200).json({
                status: true,
                products,
                message: "Products find"
            })
        } else {
            return res.status(400).json({
                status: false,
                message: "No products find"
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "No products find"
        })
    }

    /*} else {
        return res.status(400).json({
            status: false,
            message: "You can't do this action."
        })
    }*/
}

productMethod.readProduct = async (req, res) => {

    try {

        const productID = req.params.id;

        if (productID) {
            const product = await getProduct({ _id: productID });
            if (product) {
                return res.status(200).json({
                    status: true,
                    product,
                    message: "Product find"
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: "No product find"
                })
            }

        } else {
            return res.status(400).json({
                status: false,
                message: "the ID is required"
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "No products find"
        })
    }



}

productMethod.createProduct = async (req, res) => {

    // const permission = acc.can(req.user.rol.name).createAny("product").granted;

    //if (permission) {
    const verifyPoster = req.files.poster;
    const gallery = req.files.gallery ? convertGallery(req.files.gallery) : []

    if (verifyPoster) {

        const { name, description, price, discount, stock, rating, sku, productType } = req.body;

        if (name && description && price && discount && stock && sku && rating && productType) {

            const verifySKU = await getProduct({ sku: sku })

            if (!verifySKU) {
                try {
                    const product = new Product({
                        name,
                        description,
                        price,
                        poster: {
                            filename: verifyPoster[0].filename,
                            link: `/img/products/${verifyPoster[0].filename}`
                        },
                        gallery,
                        discount,
                        stock,
                        rating,
                        sku,
                        productType,

                    });
                    await product.save();

                    return res.status(200).json({
                        status: true,
                        message: "The product created successfully"
                    });
                } catch (error) {

                    fs.unlinkSync(verifyPoster[0].path);
                    if (req.files.gallery) {
                        unlinkSyncGallery(req.files.gallery)
                    }
                    return res.status(400).json({
                        status: false,
                        message: "There was a problem, please try again"
                    })
                }

            } else {
                fs.unlinkSync(verifyPoster[0].path);
                if (req.files.gallery) {
                    unlinkSyncGallery(req.files.gallery)
                }

                return res.status(400).json({
                    status: false,
                    message: "The SKU is not avaliable"
                })
            }

        } else {
            fs.unlinkSync(verifyPoster[0].path);
            if (req.files.gallery) {
                unlinkSyncGallery(req.files.gallery)
            }

            return res.status(400).json({
                status: false,
                message: "Fill all required fields"
            })
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "The poster is required"
        })
    }
    /*} else {
        if (req.files.poster) {
            fs.unlinkSync(verifyPoster[0].path);
        }
        if (req.files.gallery) {
            unlinkSyncGallery(req.files.gallery)
        }
        return res.status(400).json({
            status: false,
            message: "You can't do this action."
        })
    }*/

}

productMethod.updateProduct = async (req, res) => {
    const permission = acc.can(req.user.rol.name).updateAny("product").granted;

    if (permission) {


        const { productID, name, description, price, discount, stock, sku, rating } = req.body;

        if (productID) {

            const product = await getProduct({ _id: productID })

            if (product) {

                if (sku && sku !== product.sku) {

                    const verifySKU = await getProduct({ sku: sku })

                    if (verifySKU) {
                        return res.status(400).json({
                            status: false,
                            message: "The SKU is not avaliable"
                        })
                    }
                }

                const toUpdateProduct = {}
                name ? toUpdateProduct.name = name : false
                description ? toUpdateProduct.description = description : false
                price ? toUpdateProduct.price = price : false
                discount ? toUpdateProduct.discount = discount : false
                stock ? toUpdateProduct.stock = stock : false
                sku ? toUpdateProduct.sku = sku : false
                rating ? toUpdateProduct.rating = rating : false


                try {
                    await product.updateOne({
                        $set: toUpdateProduct
                    });

                    return res.status(200).json({
                        status: true,
                        message: "The product update successfully"
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: false,
                        message: "There was a problem, please try again"
                    })
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "The product was not found"
                })
            }

        } else {
            return res.status(400).json({
                status: false,
                message: "The ID id required"
            })
        }

    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this action."
        })
    }
}
productMethod.updateProductPoster = async (req, res) => {

    if (req.file) {

        const permission = acc.can(req.user.rol.name).updateAny("product").granted;

        if (permission) {
            const { productID } = req.body;
            if (productID) {
                const product = await getProduct({ _id: productID });
                console.log(product)
                if (product) {
                    try {
                        if (fs.existsSync(`${__dirname}/../../public${product.poster.link}`)) {
                            fs.unlink(`${__dirname}/../../public${product.poster.link}`, async () => {
                                await product.updateOne({
                                    $set: {
                                        poster: {
                                            filename: req.file.filename,
                                            link: `/img/products/${req.file.filename}`
                                        }
                                    }
                                })
                            })
                        } else {
                            await product.updateOne({
                                $set: {
                                    poster: {
                                        filename: req.file.filename,
                                        link: `/img/products/${req.file.filename}`
                                    }
                                }
                            })
                        }
                    } catch (error) {
                        return res.status(400).json({
                            status: false,
                            message: "There was a problem, please try again"
                        })
                    }
                    return res.status(200).json({
                        status: true,
                        message: "The product poster was update succesfully"
                    })

                } else {
                    fs.unlinkSync(req.file.path)
                    return res.status(400).json({
                        status: false,
                        message: "Product was not found"
                    })
                }

            } else {
                fs.unlinkSync(req.file.path)
                return res.status(400).json({
                    status: false,
                    message: "The ID is required."
                })
            }

        } else {
            fs.unlinkSync(req.file.path)
            return res.status(400).json({
                status: false,
                message: "You can't do this action."
            })
        }

    } else {
        return res.status(400).json({
            status: false,
            message: "The poster is required."
        })
    }
}
productMethod.updateProductGallery = async (req, res) => {
    if (req.files) {

        const permission = acc.can(req.user.rol.name).updateAny("product").granted;

        if (permission) {
            const { productID } = req.body;
            if (productID) {
                const product = await getProduct({ _id: productID });

                if (product) {
                    if ((product.gallery.length + req.files.length) <= 5) {
                        let productGallery = product.gallery.concat(convertGallery(req.files))

                        try {
                            await product.updateOne({ $set: { gallery: productGallery } })
                            return res.status(200).json({
                                status: true,
                                message: "The gallery was updated successfully"
                            })
                        } catch (error) {
                            unlinkSyncGallery(req.files)
                            return res.status(400).json({
                                status: false,
                                message: "There was a problem, please try again"
                            })
                        }

                    } else {
                        unlinkSyncGallery(req.files)
                        return res.status(400).json({
                            status: false,
                            message: "The Gallery has must contain 5 photos"
                        })
                    }
                } else {
                    unlinkSyncGallery(req.files)
                    return res.status(400).json({
                        status: false,
                        message: "Product was not found"
                    })
                }

            } else {
                unlinkSyncGallery(req.files)
                return res.status(400).json({
                    status: false,
                    message: "The ID is required."
                })
            }

        } else {
            unlinkSyncGallery(req.files)
            return res.status(400).json({
                status: false,
                message: "You can't do this action."
            })
        }

    } else {
        return res.status(400).json({
            status: false,
            message: "You need to upload a photo."
        })
    }
}
productMethod.deleteProduct = async (req, res) => {

    const permission = acc.can(req.user.rol.name).deleteAny("product").granted;

    if (permission) {
        const { productID } = req.body;

        if (productID) {
            try {
                const product = await getProduct({ _id: productID });

                if (product) {

                    const productSaved = product;

                    fs.unlink(`${__dirname}/../../public${product.poster.link}`, async () => {
                        const gallery = product.gallery.length > 0 ? unlinkSyncGallery(product.gallery) : [];

                        if (gallery) {
                            await product.remove();
                            return res.status(200).json({
                                status: true,
                                message: 'The product was eliminated successfully'
                            })
                        } else {
                            return res.status(400).json({
                                status: false,
                                message: 'There was a problem, please try again'
                            })
                        }
                    })

                } else {
                    return res.status(400).json({
                        status: false,
                        message: 'The productID was not found'
                    })
                }

            } catch (error) {
                return res.status(400).json({
                    status: false,
                    message: 'There was an error, please try again'
                })
            }

        } else {
            return res.status(400).json({
                status: false,
                message: 'The ID is required'
            })
        }


    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this action."
        })
    }

}
productMethod.deleteProductGalleryPhoto = async (req, res) => {


    const permission = acc.can(req.user.rol.name).deleteAny("product").granted;

    if (permission) {

        const { productID, photo } = req.body;

        if (productID && photo) {

            const product = await getProduct({ _id: productID });

            if (product) {

                if (fs.existsSync(`${__dirname}/../../public/img/products/${photo.filename}`)) {

                    fs.unlink(`${__dirname}/../../public/img/products/${photo.filename}`, async () => {
                        const newGallery = product.gallery.filter(i => i.filename !== photo.filename)
                        try {
                            await product.updateOne({ $set: { gallery: newGallery } })
                            return res.status(200).json({
                                status: true,
                                product,
                                message: "The photo was delete successfully"
                            })

                        } catch (error) {

                            return res.status(400).json({
                                status: false,
                                message: "There was a problem, please try again"
                            })
                        }
                    })

                } else {
                    return res.status(400).json({
                        status: false,
                        message: "The Photo not exist in gallery"
                    })
                }

            } else {
                return res.status(400).json({
                    status: false,
                    message: "Product was not found"
                })
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "The ID and photo is required."
            })
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "You can't do this action."
        })
    }
}

module.exports = productMethod