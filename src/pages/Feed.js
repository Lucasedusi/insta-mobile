/* eslint-disable eol-last */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import io from 'socket.io-client';
import api from '../services/api';

import {View, Text, Image, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import camera from '../assets/camera.png';
import more from '../assets/more.png';
import like from '../assets/like.png';
import comment from '../assets/comment.png';
import send from '../assets/send.png';

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('New')}>
        <Image source={camera}/>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity style={{ marginHorizontal: 12 }} onPress={() => {}}>
        <Image source={send}/>
      </TouchableOpacity>
    ),
  });

  state = {
    feed: [],
  };

  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get('posts');

    this.setState({ feed: response.data });
  }

  registerToSocket = () => {
    const socket = io('http://localhost:3333');

    socket.on('post', newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on('like', likedPost => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === likedPost._id ? likedPost : post
        ),
      });
    });
  }

  handleLike = id => {
    api.post(`/posts/${id}/like`);
  }

  render() {
    return (
      <View style={styles.container}>

      <FlatList 
        data={this.state.feed}
        keyExtractor={post => post._id}
        style={styles.scrollArea}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item }) => (
          <View>
            <Image style={styles.scrollStories} source={{ uri: `http://localhost:3333/files/${item.image}` }} />
              <View>
                <Text style={{ fontSize: 8, marginRight: 18 }}>{item.author}</Text>
              </View>
          </View>
        )}
      />


        <FlatList
          data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>

              <View style={styles.feedItemHeader}>

                <View style={styles.userInfo}>
                  <Image style={styles.thubnail} source={{ uri: `http://localhost:3333/files/${item.image}` }} />
                    <View style={styles.userDetail}>
                      <Text style={styles.name}>{item.author}</Text>
                      <Text style={styles.place}>{item.place}</Text>
                    </View>
                </View>

                <Image style={{ transform: [{ rotate: '90deg' }] }} source={more} />
              </View>

              <Image style={styles.feedImage} source={{ uri: `http://localhost:3333/files/${item.image}` }} />

              <View style={styles.feedItemFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)} >
                    <Image source={like} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() =>{}} >
                    <Image source={comment} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() =>{}} >
                    <Image source={send} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.likes}>{item.likes} curtidas</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollArea: {
    paddingVertical: 20,
    marginLeft: 10,
  },

  feedItem: {
    padding: 10,
  },

  scrollStories: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginBottom: 5,
    marginRight: 20,
  },

  feedItemHeader: {
    paddingHorizontal: 5,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userInfo: {
    flexDirection: 'row',
  },

  userDetail: {
    flexDirection: 'column',
    paddingLeft: 7,
    marginTop: 5,
  },

  thubnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  name: {
    fontSize: 14,
    color: '#000',
  },

  place: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },

  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 12,
    borderRadius: 5,
  },

  feedItemFooter: {
    paddingHorizontal: 7,
  },

  actions: {
    flexDirection: 'row',
  },

  action: {
    marginRight: 8,
  },

  likes: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#000',
  },

  description: {
    lineHeight: 18,
    color: '#000',
  },

  hashtags: {
    color: '#003569',
  },
});