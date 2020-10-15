import { getListSubscriber } from '../redux/actions/index'
import React, { useState, useEffect } from 'react'
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Popover, TablePagination, TextField, Paper, InputBase, IconButton, makeStyles, Button } from '@material-ui/core'
import AddNewVideoIcon from '../assets/icons/AddNewVideoIcon'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux'
import MoreIcon from '../assets/icons/MoreIcon'
import BanIcon from '../assets/icons/BanIcon'
import NoSubscriberIcon from '../assets/icons/NoSubscriberIcon'
import appStyle from '../styles/AppStyle'
import Autocomplete from '@material-ui/lab/Autocomplete'
import SearchIcon from '@material-ui/icons/Search'
import { CSVLink, CSVDownload } from "react-csv";
import useApi from '../customHooks/useApi'
import dynamic from 'next/dynamic'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        backgroundColor: '#272E49'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        color: 'white'
    },
    iconButton: {
        padding: 10,
    }
}))

const SubscriberList = () => {
    const appStyles = appStyle()
    const classes = useStyles()
    const dispatch = useDispatch()
    const router = useRouter()
    const { exportToCsv } = useApi()
    const { channel, subscriberList, tierList } = useSelector(state => ({
        tierList: state.tierReducer.tierList,
        channel: state.channelReducer.channel,
        subscriberList: state.subscriberListReducer.subscriberList
    }))
    const [searchText, setSearchText] = useState()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [anchorEl, setAnchorEl] = useState()
    const open = Boolean(anchorEl)
    const [listShowSubscriber, setListShowSubscriber] = useState([])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = (e) => {
        e.stopPropagation()
        setAnchorEl(null);
    }

    const handleSearch = (e) => {
        dispatch(getListSubscriber({ tierId: 0, searchText: searchText }))
        e.preventDefault()
    }

    const handleChangeSearchText = (e) => {
        setSearchText(e.target.value)
    }
    const handleKeyDownSearchText = (e) => {
        if (e.key == "Enter" && e.preventDefault()) {
            handleSearch(searchText)
        }

    }

    const timeConverter = (timestamp) => {
        var a = new Date(timestamp * 1000);
        var year = a.getFullYear()
        var month = a.getMonth()
        var date = a.getDate()
        var time = date + '/' + month + '/' + year
        return time
    }

    useEffect(() => {
        if (channel?.id) {

            dispatch(getListSubscriber({ tierId: 0, searchText: '' }))
        }
    }, [channel])

    useEffect(() => {
        if (subscriberList) {
            let list = []
            subscriberList.forEach(item => {
                let temp = {
                    joinDate: timeConverter(item.joinDate),
                    planCurrency: item.planCurrency,
                    planAmount: !item.planAmount ? '_' : '$' + item.planAmount.toString(),
                    renewOrexpDate: timeConverter(item.renewOrexpDate),
                    subscriberBanned: item.subscriberBanned,
                    subscriberEmail: item.subscriberEmail,
                    subscriberId: item.subscriberId,
                    subscriberName: item.subscriberName,
                    subscriberState: item.subscriberState,
                    tierName: item.tierName
                }
                list.push(temp)
            });
            setListShowSubscriber(list)
        }
        console.log(listShowSubscriber)
    }, [subscriberList])

    useEffect(() => {

    }, [tierList])


    return (
        <Grid container spacing={2}>
            {/* <Grid iem xs={12}>
                <button onClick={e => exportToCsv(channel.id)}>hello</button>
            </Grid> */}
            <Grid item xs={12}>
                <div style={{ margin: '0 auto', textAlign: 'center', fontSize: 48, fontWeight: 'bold' }}>
                    Subscribers
                </div>
            </Grid>

            {!subscriberList || subscriberList?.length === 0 ? (
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{ justifyContent: 'center', paddingTop: '10vh' }}>
                        <NoSubscriberIcon />
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: 'center', color: '#8F9BB3', fontSize: 18 }}>
                        No subscribers yet
                    </Grid>
                </Grid>
            ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>

                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                id="combo-box-demo"
                                options={tierList}
                                getOptionLabel={(option) => option?.name}
                                //style={{ width: 300 }}
                                onChange={(event, newValue) => {
                                    // Only need the item in the value, ignore matches property.
                                    if (newValue) {
                                        dispatch(getListSubscriber({ tierId: newValue?.id, searchText: '' }))
                                    } else {
                                        dispatch(getListSubscriber({ tierId: 0, searchText: '' }))
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="All tiers" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ alignSelf: 'center' }}>
                            <CSVLink data={listShowSubscriber}
                                filename={window.location.hostname + '_list.csv'}
                            >
                                <Button color="secondary" variant="contained" style={{
                                    width: '160px', height: '40px',
                                    fontStyle: "normal",
                                    fontSize: 14,
                                    color: '#FFFFFF',
                                    backgroundColor: '#4D2CEC'
                                }} >Export to Csv</Button>
                            </CSVLink>
                        </Grid>
                        <Grid item xs={4} style={{ alignSelf: 'center' }}>
                            <Paper component="form" className={classes.root}>
                                <IconButton className={classes.iconButton} aria-label="menu">
                                    <SearchIcon onClick={handleSearch} />
                                </IconButton>
                                <InputBase
                                    className={classes.input}
                                    placeholder="Search by name or email address"
                                    //inputProps={{ 'aria-label': 'search google maps' }}
                                    onChange={handleChangeSearchText}
                                    value={searchText}
                                    onKeyPress={handleKeyDownSearchText}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={1}>

                        </Grid>
                        <Grid item xs={12} >
                            <TableContainer className={appStyles.scrollbar}>
                                <Table aria-label="caption table">
                                    <TableHead>
                                        <TableRow color='white' style={{ color: 'white' }}>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="center">State</TableCell>
                                            <TableCell align="center">Tier</TableCell>
                                            <TableCell align="center">Plan amount</TableCell>
                                            <TableCell align="center">Joined</TableCell>
                                            <TableCell align="center">Monthly Recurring</TableCell>
                                            <TableCell align="center">Renewal or expiry date</TableCell>
                                            <TableCell align="center">Email Address</TableCell>
                                            <TableCell align="center"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listShowSubscriber?.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell style={{ color: 'white' }} scope="row">
                                                    {item.subscriberName}
                                                </TableCell>
                                                <TableCell style={{ color: 'white' }} align="left">{item.subscriberState}</TableCell>
                                                <TableCell style={{ color: 'white', whiteSpace: 'nowrap' }} align="left">{item.tierName} | {item.tierPlan === 'monthly' ? "Monthly" : "Annual"}</TableCell>
                                                <TableCell style={{ color: 'white' }} align="center">{item.planAmount}</TableCell>
                                                <TableCell style={{ color: 'white' }} align="left">{item.joinDate}</TableCell>
                                                <TableCell style={{ color: 'white' }} align="center">{item.monthlyRecurring}</TableCell>
                                                <TableCell style={{ color: 'white' }} align="center">{item.renewOrexpDate}</TableCell>
                                                <TableCell style={{ color: 'white' }} align="center">{item.subscriberEmail}</TableCell>
                                                <TableCell style={{ color: 'white' }} align="left">
                                                    <div style={{ cursor: 'pointer' }} onClick={e => setAnchorEl(e.currentTarget)}>
                                                        <MoreIcon />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <Popover
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'center',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'center',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <div style={{ width: 70, height: 40, backgroundColor: "#1D253E", color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                                <BanIcon /> Ban
                                </div>
                                        </Popover>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <TablePagination
                                component="div"
                                style={{ color: 'white' }}
                                count={subscriberList?.length || 0}
                                page={page}
                                onChangePage={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Grid>
                    </Grid>
                )}
        </Grid>
    )
}

export default dynamic(() => Promise.resolve(SubscriberList), {
    ssr: false
})
