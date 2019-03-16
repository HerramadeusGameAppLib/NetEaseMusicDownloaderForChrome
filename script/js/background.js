chrome.runtime.onInstalled.addListener
( 
	function () 
	{
		chrome.contextMenus.create
		(
			{
				type : 'normal',
				title : '下载本链接歌曲',
				id : 'download_from_music_163_com_link',
				contexts : 
				[
					'link',
				],
				documentUrlPatterns : 
				[
					'*://music.163.com/*'
				],
				targetUrlPatterns :
				[
					'*://music.163.com/song?id=*'
				]
			}
		);
	}
);

////////////////////////////////////////////////////////////

chrome.runtime.onInstalled.addListener
( 
	function () 
	{
		chrome.contextMenus.create
		(
			{
				type : 'normal',
				title : '从当前歌曲页面下载',
				id : 'download_from_music_163_com_page',
				contexts : 
				[
					'page',
				],
				documentUrlPatterns : 
				[
				    '*://music.163.com/*'
				]
			}
		);
	}
);

////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener
(
	// 监听歌曲信息消息，并在收到消息后执行下载。
	function (message, sender, sendResponse)
	{
		msgName = message["MsgName"];
		
		if("MsgDidFindSongInfo" != msgName)
		   return;
		 
		songInfo = message["SongInfo"];		
		songId = message["SongId"];
		
		downloadBySongId(songId, songInfo);
	}
);

////////////////////////////////////////////////////////////

chrome.contextMenus.onClicked.addListener
(
	function(info, tab)
	{
		var songId = null;
		switch(info.menuItemId)
		{
			case 'download_from_music_163_com_link':
				songId = getSongIdFromUrl(info.linkUrl);
				if(null == songId)
				{
					alert("下载失败！\n" + info.linkUrl + "\n不是有效的歌曲链接！");
					return;
				}
                
                chrome.tabs.sendMessage(tab.id,
                {
                    "MsgName" : "MsgFindSongInfoForLink",
                    "SongId" : songId
                });
				break;
            
			case 'download_from_music_163_com_page':
				songId = getSongIdFromUrl(info.pageUrl);
				if(null == songId)
				{
					alert("下载失败！\n" + info.pageUrl + "\n当前页面不是歌曲的主页面！");
					return;
				}
                
                chrome.tabs.sendMessage(tab.id,
                {
                    "MsgName" : "MsgFindSongInfoForPage",
                    "SongId" : songId
                });
                
				break;
			
			default:
				break;
		}
	}
);

////////////////////////////////////////////////////////////

function getSongIdFromUrl(url)
{
	if(null == url)
		return null;
	
	const key = 'song?id=';
	
	var keyLength = key.length;
	var urlLength = url.length;

	keyIdx = url.lastIndexOf(key);
	
	if(urlLength == keyIdx + keyLength || 
	    keyIdx < 0)
	{
		return null;
	}
	
	return url.substr(keyIdx + keyLength);
}

////////////////////////////////////////////////////////////

function downloadBySongId(songId, songName)
{
    if(null == songId)
    {
        alert("无效的歌曲Id！");
        return;
    }
    
    if(null == songName)
    {
        alert("无效的歌曲名称！\n将使用歌曲Id作为名称。");
    }
    
	const prefix = 'https://music.163.com/song/media/outer/url?id=';
	const suffix = '.mp3';
	
	var actualUrl = prefix + songId + suffix;
	
    // 把不符合文件名要求的字符全部修改为下划线"_"。
    // 注意，文件名的第一个字符不能为 空白字符，因此为方便起见，把所有空格也替换为下划线。
	const winFileNameInvalidCharRegExp = /[\\\\/:*?\"<>|\s]/g;
    var  actualSongName = songName.replace(winFileNameInvalidCharRegExp, "_");
	
	const fullWidthCommaRegExp = /，/g;
	actualSongName = actualSongName.replace(fullWidthCommaRegExp,  "-");
	
	////////////////////////////////////////////////////////////
    
    actualSongName += ".mp3";
    
	chrome.downloads.download(
	{
		url : actualUrl,
		filename : actualSongName,
		conflictAction : "uniquify",
		saveAs : false
	});
}
