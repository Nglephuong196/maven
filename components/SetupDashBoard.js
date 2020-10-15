import React from 'react'
import { makeStyles, Paper, Tabs, Tab } from '@material-ui/core'
import SetupStyles from './SetupStyles'
import TabPanel from '../components/TabPanel'
import TiersBase from '../components/TiersBase'
import ProfileSetup from '../components/ProfileSetup'

const useStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
      },
}))

const SetupDashBoard = () => {
    const classes = useStyle()
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div> 
        <Paper className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label="Style" />
                <Tab label="Profile" />
                <Tab label="Tiers" />
                <Tab label="Invite" />
            </Tabs>
        </Paper>
        <TabPanel value={value} index={0}>
        <SetupStyles />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProfileSetup />
      </TabPanel>
      <TabPanel value={value} index={2}>
       <TiersBase />
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
        </div>
    )
}

export default SetupDashBoard