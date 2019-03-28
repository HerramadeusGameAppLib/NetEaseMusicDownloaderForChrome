var g_titleElement = null;

//////////////////////////////////////////////////////////////////

document.onmousedown = onShouldGetRightClickedElement;    

//////////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener(onShouldSendSongInfo);

////////////////////////////////////////////////////////////

function onShouldGetRightClickedElement(mouseDownArg)
{
	if(2 == mouseDownArg.button)
	{
		g_titleElement = mouseDownArg.srcElement;
	}
}

////////////////////////////////////////////////////////////

function getSongInfoFromTitleElement(titleElement)
{
    var title = null;
    if(null == g_titleElement.title)
	{
		title = g_titleElement.getAttribute("title");
	}
	else
	{
		title = g_titleElement.title;
	}
    return title;
}

////////////////////////////////////////////////////////////

function onShouldSendSongInfo(message, sender, sendResponse)
{
	msgName = message["MsgName"];
	if("MsgFindSongInfoForLink" != msgName ||
        null == g_titleElement)
	    return;
		
    //////////////////////////////////////////////////////////////////
        
    var songId = message["SongId"];
    if(null == songId)
    {
        alert("无效的歌曲Id!");
        return;
    }
    
    //////////////////////////////////////////////////////////////////
		
    var songInfo = getSongInfoFromTitleElement(g_titleElement);
	if(null == songInfo)
        songInfo = songId;
    
    //////////////////////////////////////////////////////////////////
        
    g_titleElement = null;
        
    //////////////////////////////////////////////////////////////////
        
    if(null != songInfo)
    {
        chrome.runtime.sendMessage(null,
        {
            "MsgName" : "MsgDidFindSongInfo",
            "SongId" : songId,
            "SongInfo" : songInfo
        });
    }	
}
