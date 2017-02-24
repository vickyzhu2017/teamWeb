$(function(){
    var $accountList = $('.account-list'),
        $articleList = $('.article-list'),
        $teamList = $('.team-list'),
        $memberList = $('.member-list');

    //删除用户
    $accountList.find('.del').click(function(){
        var $target=$(this),
            _id=$target.data('id'),
            $tr=$('.item-id-'+_id);

        $.ajax({
            type:'DELETE',
            url:'/admin/account/del_account?id='+_id

        })
        .done(function(backData){
            if(backData.status=='ok'){
                alert(backData.msg);
                if($tr.length>0){
                    $tr.fadeOut();
                }
            }else{
                alert(backData.msg);
            }
        });
        return false;
    });
    //删除文章
    $articleList.find('.del').click(function(){
        var $target=$(this),
            _id=$target.data('id'),
            $tr=$('.item-id-'+_id);

        $.ajax({
            type:'DELETE',
            url:'/admin/article/del_article?id='+_id

        })
            .done(function(backData){
                if(backData.status=='ok'){
                    alert(backData.msg);
                    if($tr.length>0){
                        $tr.fadeOut();
                    }
                }else{
                    alert(backData.msg);
                }
            });
        return false;
    });
    //删除团队
    $teamList.find('.del').click(function(){
        var $target=$(this),
            _id=$target.data('id'),
            $tr=$('.item-id-'+_id);

        $.ajax({
            type:'DELETE',
            url:'/admin/team/del_team?id='+_id

        })
        .done(function(backData){
            if(backData.status=='ok'){
                alert(backData.msg);
                if($tr.length>0){
                    $tr.fadeOut();
                }
            }else{
                alert(backData.msg);
            }
        });
        return false;
    });
    //删除团队成员
    $memberList.find('.del').click(function(){
        var $target=$(this),
            _id=$target.data('id'),
            $tr=$('.item-id-'+_id);

        $.ajax({
            type:'DELETE',
            url:'/admin/member/del_member?id='+_id

        })
        .done(function(backData){
            if(backData.status=='ok'){
                alert(backData.msg);
                if($tr.length>0){
                    $tr.fadeOut();
                }
            }else{
                alert(backData.msg);
            }
        });
        return false;
    });



});