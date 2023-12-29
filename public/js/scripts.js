function addToCart(productId){
    $.ajax({
        url:'/add-to-cart/'+productId,
        method:'get',
        success:(response)=>{
            if(response.status){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Product is added to the cart',
                    showConfirmButton: false,
                    timer: 1500
                  })
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $("#cart-count").html(count)
            }
        }
    })
}

function addToWishlist(productId){
    $.ajax({
        url:'/add-to-wishlist/'+productId,
        method:'get',
        success:(response)=>{
            if(response.status){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Product is added to the wishlist',
                    showConfirmButton: false,
                    timer: 1500
                  })
                let count=$('#wish-count').html()
                count = parseInt(count)+1
                $("#wish-count").html(count)
            }
        }
    })
}