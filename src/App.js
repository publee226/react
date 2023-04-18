import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import BlogPage, { loader as postsLoader } from './pages/Blog';
import HomePage from "./pages/Home";
// import PostPage, { loader as postLoader } from "./pages/Post";
import RootLayout from "./pages/Root";

const BlogPage = lazy(() => import("./pages/Blog")); // import 함수는 Promise를 반환

const PostPage = lazy(() => import("./pages/Post"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "posts",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <BlogPage />
              </Suspense>
            ),
            // 지연로딩 - 필요할 때만 데이터를 불러옴 (App 실행 처음부터 다 불러오지 않음, 데이터의 효율적 사용)
            loader: () =>
              import("./pages/Blog").then((module) => module.loader())
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <PostPage />
              </Suspense>
            ),
            loader: ({ params }) =>
              import("./pages/Post").then((module) => module.loader({ params }))
          }
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
