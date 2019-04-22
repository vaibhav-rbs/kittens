import React from 'react';
import {StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, ActivityIndicator, TextInput, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;




class ProfileApp extends React.Component {

  

  constructor(props) {
    super(props)

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,
      text: '',
      Search: '',
      Saved: '',
      Setting: '',
      petID:0 
    }

    onPressSearch = () => {
      this.setState({
        Search: 'onSearchPage'
      })
    }
    onPressSaved = () => {
      this.setState({
        Saved: 'onSavedPage'
      })
    }
    onPressSetting = () => {
      this.setState({
        Setting: 'onSettingPage'
      })
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })

  }

async componentDidMount(){
    var response =  await fetch("https://s3-us-west-2.amazonaws.com/cozi-interview-dev/pets.json");
    var json = await response.json();
    
    this.setState({ data: json });
  };

  
componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log(evt)
        console.log(this.state.petID)

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              // this.props.likePets(this.state.currentIndex);
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              // this.props.dislikePets(this.state.currentIndex);
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }
  

   renderUsers = () => {
     if (this.state['data']) {
      return  this.state['data'].map((item, i) => {
        this.setState({
          petID: item.id
        })

        if (i < this.state.currentIndex) {
          return null
        }
        else if (i == this.state.currentIndex) {
  
          return (
            
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 360, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
              <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
              </Animated.View>
  
              <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
  
              </Animated.View>
  
              <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                source={{uri: item.img}} />
            <Text style={[{ paddingTop: this.props.variant ? 10 : 15, paddingBottom: this.props.variant ? 5 : 7, color: '#363636', fontSize: this.props.variant ? 15 : 30}]}>{item.name}, {item.age}yrs,  {item.sex}</Text>

            <TextInput style={{height: null, borderColor: 'gray', borderWidth: 2}} editable = {false} maxLength = {20}  multiline = {true} value={item.profile} />
            
            </Animated.View>


          )
        }
        else {
          return (
            <Animated.View
  
              key={item.id} style={[{
                opacity: this.nextCardOpacity,
                transform: [{ scale: this.nextCardScale }],
                height: SCREEN_HEIGHT - 360, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
              }]}>
              <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
  
              </Animated.View>
  
              <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
  
              </Animated.View>
  
              <Image
                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                source={{uri:item.img}} />

  
            </Animated.View>
          )
        }
      }).reverse()

     } else {
      <ActivityIndicator size="small" color="#0000ff" style={[styles.container, styles.horizontal]} />
     }


  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}>

        </View>
        <View style={{ flex: 1 }}>
          {this.renderUsers()}
        </View>
        <View style={styles.button}>
        <TouchableOpacity
         onPress={this.onPressSearch}
       >
         <Text> Search </Text>

       </TouchableOpacity>
       <TouchableOpacity
         style={styles.button}
         onPress={this.onPressSaved}
       >
         <Text> Saved </Text>
        
       </TouchableOpacity>
       <TouchableOpacity
         style={styles.button}
         onPress={this.onPressSetting}
       >
         <Text> Setting </Text>
         
       </TouchableOpacity>

        </View>


      </View>

    );
  }
}

function mapStateToProps(state){
  return {
    likedPets: state.likedPets,
    dislikedPets: state.dislikedPets
  }
}
function mapDispatchToProps(dispatch){
  return{
    likePets: (i)=> dispatch({type:'LIKE_PETS', index: i }),
    dislikePets: (i)=> dispatch({type:'DISLIKE_PETS', index: i})
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(ProfileApp)



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
     height: 50,
     
  },
});