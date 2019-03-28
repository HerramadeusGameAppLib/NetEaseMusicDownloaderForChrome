chrome.runtime.onMessage.addListener(onShouldSendSongInfo);

////////////////////////////////////////////////////////////

function onShouldSendSongInfo(message, sender, sendResponse)
{
    if(null == message)
        return;
    
    var msgName = message["MsgName"];
    if("MsgFindSongInfoForPage" != msgName)
        return;
        
    var songId = message["SongId"];
    if(null == songId)
    {
       alert("无效的歌曲Id!");
       return;
    }
	
    // 从本页面获取歌曲信息。
    var songInfo = acquireSongInfo();
    
    if(null != songInfo)
    {
        chrome.runtime.sendMessage
        (null,
        {
            "MsgName" : "MsgDidFindSongInfo",
            "SongId" : songId,
            "SongInfo" : songInfo
        });
    }
}

function acquireSongInfo()
{
    var songInfo = null;
    var iframe = document.getElementById("g_iframe").contentDocument;
    if(null != iframe)
    {
        var keywords = iframe.getElementsByName("keywords");
        if(0 != keywords.length)
        {
            songInfo = keywords[0].getAttribute("content");
        }
    }
    
    if(null == songInfo)
        alert("歌曲页面结构更新了，需要更新当前算法！\n请联系开发者:herramadeus@163.com");
    
    return songInfo;
}
