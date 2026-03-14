import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Replaces useParams
import Navigation from '../../components/Navigation'; // Adjust path
import Comments from '../../components/Comments';
import InteractionBar from '../../components/InteractionBar';
import { BASE_URL } from '../../constants/api';
export default function BlogPostPage() {
  const { id } = useLocalSearchParams(); // Access the [id] from the URL
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // IMPORTANT: Replace 'localhost' with your computer's IP address!
        const res = await fetch(`${BASE_URL}/content/${id}`);
        const data = await res.json();
        if (data.success) setPost(data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" /></View>
  );
  
  if (!post) return (
    <View style={styles.center}><Text>Post not found</Text></View>
  );

  return (
    // ScrollView replaces the main/body scroll behavior
    <ScrollView style={styles.container}>
      <Navigation />
      
      <View style={styles.article}>
        <View style={styles.header}>
          <Text style={styles.title}>{post.header}</Text>
          <Text style={styles.subHeader}>{post.subHeader}</Text>
          
          <View style={styles.meta}>
            <Text style={styles.author}>{post.author?.username}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>

        <Text style={styles.content}>{post.content}</Text>

        <View style={styles.divider} />
        
        <InteractionBar post={post} updatePostState={setPost} />
        <Comments contentId={post._id} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  article: { paddingHorizontal: 20, paddingVertical: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subHeader: { fontSize: 18, color: '#666', fontStyle: 'italic' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  author: { fontWeight: 'bold' },
  dot: { marginHorizontal: 8, color: '#ccc' },
  date: { color: '#999' },
  content: { fontSize: 16, lineHeight: 24, color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 30 }
});