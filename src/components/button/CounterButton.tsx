import {Button, type ButtonProps} from "@mantine/core";
import React from "react";
import classes from './CounterButton.module.css';

export function CounterButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <Button {...props} radius="md" classNames={classes} />;
}