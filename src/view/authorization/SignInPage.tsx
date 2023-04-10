import React, {useState} from 'react';
import {
  CPNButton,
  CPNPageView,
  CPNSliderValidator,
  CPNText,
  CPNPageModal,
} from '@/components/base';
import {StoreRoot} from '@/store';
import {Image, View} from 'react-native';
import {getRandomInteger} from '@/utils/tools';
import {LS_Token} from '@/store/localStorage';

const imageDataList = [
  {
    image:
      'https://ts1.cn.mm.bing.net/th/id/R-C.98fb9e4d0fc213f3bd6bfd332b255f26?rik=T1VabF78Ml6D%2fw&riu=http%3a%2f%2fi.52desktop.cn%3a81%2fupimg%2fallimg%2f071214%2f11a601X03PE9433.jpg&ehk=HKa%2f5j67r0E%2fvcVpIaPiNVDn1ltQwiSX9Nakftno0k8%3d&risl=&pid=ImgRaw&r=0',
    slider:
      'https://ts1.cn.mm.bing.net/th/id/R-C.98fb9e4d0fc213f3bd6bfd332b255f26?rik=T1VabF78Ml6D%2fw&riu=http%3a%2f%2fi.52desktop.cn%3a81%2fupimg%2fallimg%2f071214%2f11a601X03PE9433.jpg&ehk=HKa%2f5j67r0E%2fvcVpIaPiNVDn1ltQwiSX9Nakftno0k8%3d&risl=&pid=ImgRaw&r=0',
  },
  {
    image:
      'https://ts1.cn.mm.bing.net/th/id/R-C.437259fbe6c55307357dc94331388ba1?rik=dot72t4oB2W68Q&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20171018%2f65e002f3eecc411b8f76ebb55e227452.jpeg&ehk=c5L%2bEkl8cyVqFZkwbu8%2f%2bmxSuefyIUK0fWxDpw%2bJcBw%3d&risl=1&pid=ImgRaw&r=0',
    slider:
      'https://ts1.cn.mm.bing.net/th/id/R-C.437259fbe6c55307357dc94331388ba1?rik=dot72t4oB2W68Q&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20171018%2f65e002f3eecc411b8f76ebb55e227452.jpeg&ehk=c5L%2bEkl8cyVqFZkwbu8%2f%2bmxSuefyIUK0fWxDpw%2bJcBw%3d&risl=1&pid=ImgRaw&r=0',
  },
  {
    image:
      'https://ts1.cn.mm.bing.net/th/id/R-C.15e970cd0765096178a6da16993cfbb1?rik=IT5KfevidZcTig&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1210%2f22%2fc0%2f14558824_1350879506501.jpg&ehk=X9ro%2fg%2fGTmsglVrbV%2bmy8c3wsAvcHseqcEhsf80RMWA%3d&risl=&pid=ImgRaw&r=0',
    slider:
      'https://ts1.cn.mm.bing.net/th/id/R-C.15e970cd0765096178a6da16993cfbb1?rik=IT5KfevidZcTig&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1210%2f22%2fc0%2f14558824_1350879506501.jpg&ehk=X9ro%2fg%2fGTmsglVrbV%2bmy8c3wsAvcHseqcEhsf80RMWA%3d&risl=&pid=ImgRaw&r=0',
  },
  {
    image:
      'https://ts1.cn.mm.bing.net/th/id/R-C.5a49085e4afe4261c8994e7b2ad91842?rik=VxQQBSuFk%2f%2ftaA&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fbbs4%2f200810%2f17%2f1224206085128.jpg&ehk=QaHcMJfNlSmAGrzRh6DkCiRkBlEs9J5Tw95WfADpO9E%3d&risl=&pid=ImgRaw&r=0',
    slider:
      'https://ts1.cn.mm.bing.net/th/id/R-C.5a49085e4afe4261c8994e7b2ad91842?rik=VxQQBSuFk%2f%2ftaA&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fbbs4%2f200810%2f17%2f1224206085128.jpg&ehk=QaHcMJfNlSmAGrzRh6DkCiRkBlEs9J5Tw95WfADpO9E%3d&risl=&pid=ImgRaw&r=0',
  },
  {
    image:
      'https://ts1.cn.mm.bing.net/th/id/R-C.e94ef9ad85f3acf826f9b92b7b0e2af3?rik=GCyc3ILc%2fR6oHA&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0708%2f0708fms2.jpg&ehk=Ky74%2bKo0AxiJBCI0rEGWBicFSI5tPFrvPqxZDry67%2fY%3d&risl=&pid=ImgRaw&r=0',
    slider:
      'https://ts1.cn.mm.bing.net/th/id/R-C.e94ef9ad85f3acf826f9b92b7b0e2af3?rik=GCyc3ILc%2fR6oHA&riu=http%3a%2f%2fpic.zsucai.com%2ffiles%2f2013%2f0708%2f0708fms2.jpg&ehk=Ky74%2bKo0AxiJBCI0rEGWBicFSI5tPFrvPqxZDry67%2fY%3d&risl=&pid=ImgRaw&r=0',
  },
];
function getVerifyData() {
  const index = getRandomInteger(0, 4);
  const item = imageDataList[index];
  return {
    isVerification: false,
    sliderDy: 80,
    sliderWidth: 50,
    sliderHeight: 50,
    sliderUrl: item.slider,
    imageWidth: 300,
    imageHeight: 200,
    imageUrl: item.image,
  };
}

function wait(timer: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), timer);
  });
}

export function SignInPage() {
  const rootDispatch = StoreRoot.useDispatch();

  const [showModalPage, showModalPageSet] = useState(false);
  function renderModalPage() {
    return (
      <>
        <CPNButton
          style={{marginBottom: 20}}
          text="open ModalPage"
          onPress={() => {
            showModalPageSet(true);
          }}
        />
        <CPNPageModal.View
          show={showModalPage}
          gestureEnabled
          onClose={() => showModalPageSet(false)}>
          <CPNPageView
            safeArea={false}
            leftIconType="close"
            onPressLeftIcon={() => showModalPageSet(false)}>
            <View style={{padding: 20}}>
              <CPNText>test CPNPageModal</CPNText>
            </View>
          </CPNPageView>
        </CPNPageModal.View>
      </>
    );
  }

  return (
    <CPNPageView titleText="SignIn">
      <View style={{padding: 20}}>
        <View style={{marginBottom: 10}}>
          <CPNSliderValidator
            minSliderDx={0}
            onClickVerification={async () => {
              const data = getVerifyData();
              await Image.prefetch(data.imageUrl);
              await wait(3000);
              return data;
            }}
            onRefresh={async () => {
              const data = getVerifyData();
              await Image.prefetch(data.imageUrl);
              await wait(3000);
              return data;
            }}
            onSliderVerification={async dx => {
              await wait(3000);
              return dx > 100 && dx < 200;
            }}
          />
        </View>

        <CPNButton
          style={{marginBottom: 20}}
          onPress={() => {
            LS_Token.set('aaaa');
            rootDispatch('isSignIn', true);
          }}>
          <CPNText>SignIn</CPNText>
        </CPNButton>

        {renderModalPage()}

        <View style={{height: 300}} />

        <View style={{marginBottom: 10}}>
          <CPNSliderValidator
            clickTipsText="点击进行验证(成功)"
            successfulText="验证成功"
            sliderTipsText="滑动滑块使图片完整"
            onClickVerification={async () => {
              await wait(3000);
              return {isVerification: true};
            }}
            onSliderVerification={async dx => {
              await wait(3000);
              return dx > 100 && dx < 200;
            }}
          />
        </View>

        <View style={{marginBottom: 10}}>
          <CPNSliderValidator
            clickTipsText="点击进行验证"
            successfulText="验证成功"
            sliderTipsText="滑动滑块使图片完整"
            onClickVerification={async () => {
              const data = getVerifyData();
              await Image.prefetch(data.imageUrl);
              await wait(3000);
              return data;
            }}
            onSliderVerification={async dx => {
              await wait(3000);
              return dx > 100 && dx < 200;
            }}
          />
        </View>
      </View>
    </CPNPageView>
  );
}
