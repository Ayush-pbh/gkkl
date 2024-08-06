import AllPosts from "./components/AllPosts/AllPosts";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <AllPosts />
        </main>
    );
}
