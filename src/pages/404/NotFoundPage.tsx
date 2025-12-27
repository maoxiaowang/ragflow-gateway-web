import {Button, Container, Group, Text, Title} from '@mantine/core';
import {Illustration} from './Illustration';
import classes from './NotFoundPage.module.css';
import {useNavigate} from 'react-router-dom';

export function NotFoundPage() {

  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  const goHome = () => {
    navigate('/', { replace: true });
  };
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image}/>
        <div className={classes.content}>
          <Title className={classes.title}>页面不存在</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            抱歉，当前访问的页面不存在，可能是地址错误，
            或该资源已被删除、移动。
          </Text>
          <Group justify="center">
            <Button size="md"  onClick={goHome}>返回首页</Button>
            <Button size="md" variant="default" onClick={goBack}>返回上一页</Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}