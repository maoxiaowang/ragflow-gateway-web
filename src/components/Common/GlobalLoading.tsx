import {Center, Loader, Overlay} from "@mantine/core";
import {useLoading} from "@/context/LoginContext.tsx";

export function GlobalLoading() {
  const { loading } = useLoading();
  if (!loading) return null;

  return (
    <Overlay opacity={0.3} zIndex={9999}>
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    </Overlay>
  );
}