import React, { useState, useEffect } from 'react'
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TablePagination } from '@material-ui/core'
import AddNewVideoIcon from '../assets/icons/AddNewVideoIcon'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux'
import { getVideoCreator } from '../redux/actions';
import moment from 'moment'
import Link from 'next/link'


const VideoListCreator = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { channel, videoList } = useSelector(state => ({
        channel: state.channelReducer.channel,
        videoList: state.videoCreatorReducer.videoList
    }))
    const [videoListReverse, setVideoListReverse] = useState()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const changeSeconds = (SECONDS) => {
        return new Date(SECONDS * 1000).toISOString().substr(11, 8)
    }

    const handleRedirect = (item) => {
        // if (item.status == "STARTED") {      
        //     router.replace('/upload-video')
        // } else {
            router.replace(`/video-details?id=${item.id}`)
        //}       
    }

    useEffect(() => {
        if (channel?.id) {
    
            dispatch(getVideoCreator({ channelId: channel.id }))
        }
    }, [channel])

    useEffect(() => {
        if (videoList) {
            setVideoListReverse(videoList.reverse())
        }
    }, [videoList])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{ margin: '0 auto', textAlign: 'center', fontSize: 48, fontWeight: 'bold' }}>
                    Videos
                </div>
            </Grid>
            <Grid item xs={12}>
                <div onClick={e => {
                    router.push('/upload-video')
                }}>
                <AddNewVideoIcon  />
                </div>
                
            </Grid>
            <Grid item xs={12}>
                <TableContainer >
                    <Table aria-label="caption table">

                        <TableHead>
                            <TableRow color='white' style={{ color: 'white' }}>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Duration</TableCell>
                                <TableCell align="right">Date upload</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {videoListReverse?.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((item) => (
                                <TableRow  key={item.id} onClick={(e) => handleRedirect(item)} style={{cursor: 'pointer'}}>
                                    <TableCell style={{ color: 'white' }} scope="row">
                                        {item.info[0]?.title}
                                    </TableCell>
                                    <TableCell style={{ color: 'white' }} align="right">{item.status == "PUBLISH" ? "PUBLISHED" : item.status}</TableCell>
                                    <TableCell style={{ color: 'white' }} align="right">{changeSeconds(item.duration)}</TableCell>
                                    <TableCell style={{ color: 'white' }} align="right">{moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>

            </Grid>
            <Grid item xs={12}>
                <TablePagination
                    component="div"
                    style={{color: 'white'}}
                    count={videoList.length}
                    page={page}
                    onChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    )
}

export default VideoListCreator