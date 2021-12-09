import logo from './logo.svg';
import './style.scss';
import {LikeIcon, ReplyIcon, RetweetIcon, ShareIcon, VerifiedIcon} from "./icons";
import {AvatarLoader} from "./loaders";
import React, {useState, createRef, useEffect} from "react";
import {useScreenshot} from "use-react-screenshot";


const tweetFormat = tweet => {
    tweet = tweet
        .replace(/@([\w]+)/g, '<span>@$1</span>')
        .replace(/#([\wşçöğüıİ]+)/gi, '<span>#$1</span>')
        .replace(/(https?:\/\/[\w\.\/]+)/, '<span>$1</span>')
        .replace(/\n/g, '<br />');
    return tweet;
};
const formatNumber = number => {
    if (!number) {
        number = 0;
        return number;
    } else if (number<1000) {
        return number;
    } else if (number<1000000) {
        number = (number / 1000).toFixed(3);
        number = String(number).split('.');
        return (
            number[0] + (number[1] > 100 ? ',' + number[1].slice(0,1) + 'B' : 'B')
        );
    } else {
        number = (number / 1000000).toFixed(6);
        number = String(number).split('.');
        return (
            number[0] + (number[1] > 100000 ? ',' + number[1].slice(0,2) + 'M' : 'M')
        );
    }


}
function App() {
    const tweetRef = createRef(null)
    const [name,setName] = useState();
    const [userName,setUsername] = useState();
    const [isVerified,setIsVerified] = useState(false);
    const [tweet,setTweet] = useState();
    const [retweets,setRetweets] = useState(0);
    const [quoteTweets,setQuoteTweets] = useState(0);
    const [likes,setLikes] = useState(0);
    const [profileImage, setProfileImage] = useState('https://pbs.twimg.com/profile_images/930903076046884869/juEr7F0T_bigger.jpg');
    const [image, takeScreenShot] = useScreenshot();
    const getImage = () => takeScreenShot(tweetRef.current);

    useEffect(() => {
        console.log(image);
    }, [image]);

    const profileImageHandle = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', function (){
            setProfileImage(this.result)
        });
        reader.readAsDataURL(file);
    }


  return (
      <>
      <div className="tweet-settings">
          <h3>Tweet Ayarları</h3>
          <ul>
              <li><label>Ad Soyad</label><input type="text" className="input" value={name} onChange={e => setName(e.target.value)} /></li>
              <li><label>Kullanıcı Adı</label><input type="text" className="input" value={userName} onChange={e => setUsername(e.target.value)} /></li>
              <li><label>Tweet</label><textarea maxLength="290" className="input" value={tweet} onChange={e => setTweet(e.target.value)} /></li>
              <li><label>Profil Resmi</label><input type="file" className="input" onChange={profileImageHandle} /></li>
              <li><label>Beğeni</label><input type="text" className="input" value={likes} onChange={e => setLikes(e.target.value)} /></li>
              <li><label>Retweet</label><input type="text" className="input" value={retweets} onChange={e => setRetweets(e.target.value)} /></li>
              <li><label>Alıntı Tweetler</label><input type="text" className="input" value={quoteTweets} onChange={e => setQuoteTweets(e.target.value)} /></li>
              <li><label>Onaylanmış Hesap mı?</label><input type="text" className="input" value={isVerified} onChange={e => setIsVerified(e.target.value)} /></li>
              <button onClick={getImage}>Oluştur</button>
              {image &&  (<div><a href={image} download="tweet.png">Tweeti İndir</a> </div>)}
          </ul>
      </div>
          <div className='tweet-container'>
              <div className='tweet' ref={tweetRef}>
                  <div className='tweet-author'>
                      {(profileImage && <img src={ profileImage} />) || AvatarLoader }
                      <div>
                          <div className='name'>
                              {name || "Ad-Soyad"}
                              {isVerified && <VerifiedIcon />}</div>
                          <div className='username'>@{userName || "Kullanıcı Adı"}</div>
                      </div>
                  </div>
                  <div className='tweet-content'>
                      <p dangerouslySetInnerHTML={{
                          __html:
                              (tweet && tweetFormat(tweet)) || "Bu alana örnek tweet gelecek"
                      }}></p>
                  </div>
                  <div className="tweet-stats">
            <span>
                <b>{formatNumber(retweets)}</b> Retweet
            </span>
                      <span>
                <b>{formatNumber(quoteTweets)}</b> Alıntı Tweetler
            </span>
                      <span>
                <b>{formatNumber(likes)}</b> Beğeni
            </span>
                  </div>
                  <div className="tweet-actions">
                      <span><ReplyIcon /></span>
                      <span onClick={e => setRetweets(Number(retweets)+1)}><RetweetIcon /></span>
                      <span><LikeIcon /></span>
                      <span><ShareIcon /></span>
                  </div>
              </div>
          </div>
      </>
  );
}

export default App;
